"""Async service for querying Groq models as a fallback."""

from __future__ import annotations

import logging
import os
from collections.abc import AsyncIterator, Iterable
from typing import Any

from groq import AsyncGroq

from app.ai.schemas import ChatMessage, ChatRequest, GenerateRequest, ModelResponse

logger = logging.getLogger(__name__)


class GroqModelError(RuntimeError):
    """Raised when a Groq model request fails."""


class GroqModelClient:
    """Async client wrapper for Groq API, conforming to the same consumer interface."""

    def __init__(
        self,
        api_key: str | None = None,
        model: str | None = None,
    ) -> None:
        self.api_key = api_key or os.getenv("GROQ_API_KEY")
        self.default_model = model or os.getenv("GROQ_MODEL") or "openai/gpt-oss-20b"
        self._owns_client = True
        self._client = AsyncGroq(api_key=self.api_key) if self.api_key else None

    async def __aenter__(self) -> GroqModelClient:
        return self

    async def __aexit__(self, *_: object) -> None:
        await self.close()

    async def close(self) -> None:
        if self._owns_client and self._client is not None:
            close = getattr(self._client, "close", None)
            if close is not None:
                await close()

    async def chat(
        self,
        request: ChatRequest,
    ) -> ModelResponse:
        if self._client is None:
            # Re-initialize to see if API key became available in environment
            self.api_key = self.api_key or os.getenv("GROQ_API_KEY")
            if self.api_key:
                self._client = AsyncGroq(api_key=self.api_key)
            else:
                raise GroqModelError("Groq API key not set. Please set GROQ_API_KEY environment variable.")

        model = request.model
        if not model or ":" in model:
            model = self.default_model

        kwargs = self._build_payload(request, model)

        try:
            completion = await self._client.chat.completions.create(
                **kwargs,
                stream=False,
            )
        except Exception as exc:
            raise GroqModelError(str(exc)) from exc

        content = completion.choices[0].message.content or ""
        return ModelResponse(
            model=model,
            content=content,
            raw=completion.model_dump() if hasattr(completion, "model_dump") else dict(completion),
        )

    async def stream_chat(
        self,
        request: ChatRequest,
    ) -> AsyncIterator[str]:
        if self._client is None:
            self.api_key = self.api_key or os.getenv("GROQ_API_KEY")
            if self.api_key:
                self._client = AsyncGroq(api_key=self.api_key)
            else:
                raise GroqModelError("Groq API key not set. Please set GROQ_API_KEY environment variable.")

        model = request.model
        if not model or ":" in model:
            model = self.default_model

        kwargs = self._build_payload(request, model)

        try:
            stream = await self._client.chat.completions.create(
                **kwargs,
                stream=True,
            )
            async for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        except Exception as exc:
            raise GroqModelError(str(exc)) from exc

    async def generate(
        self,
        request: GenerateRequest,
    ) -> ModelResponse:
        chat_request = ChatRequest(
            messages=[ChatMessage(role="user", content=request.prompt)],
            model=request.model,
            system=request.system,
            options=request.options,
            format=request.format,
        )
        return await self.chat(chat_request)

    async def stream_generate(
        self,
        request: GenerateRequest,
    ) -> AsyncIterator[str]:
        chat_request = ChatRequest(
            messages=[ChatMessage(role="user", content=request.prompt)],
            model=request.model,
            system=request.system,
            options=request.options,
            format=request.format,
        )
        async for chunk in self.stream_chat(chat_request):
            yield chunk

    def _build_payload(self, request: ChatRequest, model: str) -> dict[str, Any]:
        messages = _with_system_message(request.messages, request.system)
        
        options = request.options or {}
        temperature = options.get("temperature", 1.0)
        top_p = options.get("top_p", 1.0)
        stop = options.get("stop", None)
        reasoning_effort = options.get("reasoning_effort", "medium")

        payload: dict[str, Any] = {
            "model": model,
            "messages": [{"role": msg.role, "content": msg.content} for msg in messages],
            "temperature": temperature,
            "top_p": top_p,
            "stop": stop,
        }

        # Handle max tokens (omit from payload if not specified to avoid rate limiter limits)
        max_tokens = (
            options.get("max_completion_tokens")
            or options.get("max_tokens")
            or options.get("num_predict")
        )
        if max_tokens is not None:
            payload["max_completion_tokens"] = max_tokens

        # Only pass reasoning_effort if the model is a reasoning model or explicitly requested
        if "gpt-oss" in model or "o1" in model or "o3" in model or "reasoning" in options:
            payload["reasoning_effort"] = reasoning_effort

        return payload


def _with_system_message(
    messages: Iterable[ChatMessage],
    system: str | None,
) -> list[ChatMessage]:
    if system is None:
        return list(messages)

    return [ChatMessage(role="system", content=system), *messages]
