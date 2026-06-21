"""Reusable async service for querying local Ollama models."""

from __future__ import annotations

import asyncio
import logging
from collections.abc import AsyncIterator, Iterable
from typing import Any

from httpx import HTTPError
from ollama import AsyncClient, ResponseError

from app.ai.config import OllamaSettings
from app.ai.schemas import ChatMessage, ChatRequest, GenerateRequest, ModelResponse

logger = logging.getLogger(__name__)


class OllamaModelError(RuntimeError):
    """Raised when an Ollama model request fails."""


_OLLAMA_EXCEPTIONS = (ConnectionError, HTTPError, ResponseError, TimeoutError)
_MAX_RETRIES = 3
_BASE_DELAY = 1.0
_MAX_DELAY = 10.0


class OllamaModelClient:
    """Thin application wrapper around the official Ollama async client."""

    def __init__(
        self,
        settings: OllamaSettings | None = None,
        client: AsyncClient | None = None,
        max_retries: int = _MAX_RETRIES,
    ) -> None:
        self.settings = settings or OllamaSettings.from_env()
        self._max_retries = max_retries
        self._owns_client = client is None
        self._client = client or AsyncClient(
            host=self.settings.host,
            timeout=self.settings.timeout,
        )

    async def __aenter__(self) -> "OllamaModelClient":
        return self

    async def __aexit__(self, *_: object) -> None:
        await self.close()

    async def close(self) -> None:
        if not self._owns_client:
            return

        close = getattr(self._client, "aclose", None)
        if close is not None:
            await close()
            return

        raw_client = getattr(self._client, "_client", None)
        raw_close = getattr(raw_client, "aclose", None)
        if raw_close is not None:
            await raw_close()

    async def chat(
        self,
        request: ChatRequest,
    ) -> ModelResponse:
        return await self._with_retry(self._chat, request)

    async def _chat(self, request: ChatRequest) -> ModelResponse:
        try:
            response = await self._client.chat(**self._chat_payload(request))
        except _OLLAMA_EXCEPTIONS as exc:
            raise OllamaModelError(str(exc)) from exc

        data = _to_dict(response)
        message = data.get("message") or {}
        content = message.get("content", "")

        return ModelResponse(
            model=data.get("model", request.model or self.settings.model),
            content=content,
            raw=data,
        )

    async def stream_chat(
        self,
        request: ChatRequest,
    ) -> AsyncIterator[str]:
        try:
            stream = await self._client.chat(
                **self._chat_payload(request),
                stream=True,
            )

            async for chunk in stream:
                message = _to_dict(chunk).get("message") or {}
                content = message.get("content")
                if content:
                    yield content
        except _OLLAMA_EXCEPTIONS as exc:
            raise OllamaModelError(str(exc)) from exc

    async def generate(
        self,
        request: GenerateRequest,
    ) -> ModelResponse:
        return await self._with_retry(self._generate, request)

    async def _generate(self, request: GenerateRequest) -> ModelResponse:
        try:
            response = await self._client.generate(**self._generate_payload(request))
        except _OLLAMA_EXCEPTIONS as exc:
            raise OllamaModelError(str(exc)) from exc

        data = _to_dict(response)

        return ModelResponse(
            model=data.get("model", request.model or self.settings.model),
            content=data.get("response", ""),
            raw=data,
        )

    async def stream_generate(
        self,
        request: GenerateRequest,
    ) -> AsyncIterator[str]:
        try:
            stream = await self._client.generate(
                **self._generate_payload(request),
                stream=True,
            )

            async for chunk in stream:
                content = _to_dict(chunk).get("response")
                if content:
                    yield content
        except _OLLAMA_EXCEPTIONS as exc:
            raise OllamaModelError(str(exc)) from exc

    async def list_models(self) -> list[dict[str, Any]]:
        try:
            response = await self._client.list()
        except _OLLAMA_EXCEPTIONS as exc:
            raise OllamaModelError(str(exc)) from exc

        return [_to_dict(model) for model in _to_dict(response).get("models", [])]

    async def _with_retry(
        self,
        fn: callable,
        *args: Any,
        **kwargs: Any,
    ) -> Any:
        last_exc: Exception | None = None
        for attempt in range(self._max_retries):
            try:
                return await fn(*args, **kwargs)
            except OllamaModelError as exc:
                last_exc = exc
                if attempt < self._max_retries - 1:
                    delay = min(_BASE_DELAY * (2 ** attempt), _MAX_DELAY)
                    logger.warning(
                        "Ollama request failed (attempt %d/%d), retrying in %.1fs: %s",
                        attempt + 1, self._max_retries, delay, exc,
                    )
                    await asyncio.sleep(delay)
                else:
                    logger.error(
                        "Ollama request failed after %d attempts: %s",
                        self._max_retries, exc,
                    )
        raise last_exc  # type: ignore[misc]

    def _chat_payload(self, request: ChatRequest) -> dict[str, Any]:
        messages = _with_system_message(request.messages, request.system)
        payload: dict[str, Any] = {
            "model": request.model or self.settings.model,
            "messages": [message.to_ollama() for message in messages],
        }
        return self._with_common_options(payload, request.options, request.format)

    def _generate_payload(self, request: GenerateRequest) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "model": request.model or self.settings.model,
            "prompt": request.prompt,
        }

        if request.system:
            payload["system"] = request.system

        return self._with_common_options(payload, request.options, request.format)

    def _with_common_options(
        self,
        payload: dict[str, Any],
        options: dict[str, Any],
        response_format: str | dict[str, Any] | None,
    ) -> dict[str, Any]:
        if options:
            payload["options"] = options

        if response_format is not None:
            payload["format"] = response_format

        if self.settings.keep_alive is not None:
            payload["keep_alive"] = self.settings.keep_alive

        return payload


def _with_system_message(
    messages: Iterable[ChatMessage],
    system: str | None,
) -> list[ChatMessage]:
    if system is None:
        return list(messages)

    return [ChatMessage(role="system", content=system), *messages]


def _to_dict(value: Any) -> dict[str, Any]:
    if hasattr(value, "model_dump"):
        return value.model_dump()

    return dict(value)
