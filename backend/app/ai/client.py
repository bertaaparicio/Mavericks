"""Reusable async client with configurable Groq/Ollama provider priority."""

from __future__ import annotations

import asyncio
import logging
import os
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


class AIModelClient:
    """Async model client.

    ``AI_PROVIDER=groq`` makes Groq the primary provider. Ollama remains
    available as a fallback and can be restored as primary with
    ``AI_PROVIDER=ollama`` without changing application code.
    """

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
        self._groq_client: Any | None = None
        self.provider = _provider_name(os.getenv("AI_PROVIDER", "groq"))
        self.fallback_provider = _provider_name(
            os.getenv("AI_FALLBACK_PROVIDER", "ollama")
        )

    def _get_groq_client(self) -> Any | None:
        if self._groq_client is None:
            from app.ai.groq_client import GroqModelClient

            api_key = os.getenv("GROQ_API_KEY")
            if api_key:
                self._groq_client = GroqModelClient(api_key=api_key)
            else:
                logger.warning(
                    "Groq API key not found in environment; fallback to Groq will be disabled."
                )
        return self._groq_client

    async def __aenter__(self) -> "AIModelClient":
        return self

    async def __aexit__(self, *_: object) -> None:
        await self.close()

    async def close(self) -> None:
        if self._groq_client is not None:
            close = getattr(self._groq_client, "close", None)
            if close is not None:
                try:
                    await close()
                except TypeError:
                    if callable(close):
                        close()

        if not self._owns_client:
            return

        close = getattr(self._client, "aclose", None)
        if close is not None:
            try:
                await close()
            except TypeError:
                if callable(close):
                    close()
            return

        raw_client = getattr(self._client, "_client", None)
        raw_close = getattr(raw_client, "aclose", None)
        if raw_close is not None:
            try:
                await raw_close()
            except TypeError:
                if callable(raw_close):
                    raw_close()

    async def chat(
        self,
        request: ChatRequest,
    ) -> ModelResponse:
        if self.provider == "groq":
            groq_client = self._get_groq_client()
            if groq_client is not None:
                try:
                    return await groq_client.chat(request)
                except Exception as exc:
                    logger.warning("Groq chat failed: %s", exc)
                    if self.fallback_provider != "ollama":
                        raise OllamaModelError(f"Groq request failed: {exc}") from exc
            elif self.fallback_provider != "ollama":
                raise OllamaModelError(
                    "Groq is the selected provider but GROQ_API_KEY is not configured."
                )

            logger.warning("Falling back from Groq to Ollama for chat.")
            return await self._with_retry(self._chat, request)

        try:
            return await self._with_retry(self._chat, request)
        except OllamaModelError as exc:
            logger.warning("Ollama chat failed: %s. Falling back to Groq...", exc)
            groq_client = self._get_groq_client()
            if groq_client:
                try:
                    return await groq_client.chat(request)
                except Exception as groq_exc:
                    logger.error("Groq fallback chat failed: %s", groq_exc)
                    raise OllamaModelError(
                        f"Ollama failed ({exc}) and Groq fallback failed ({groq_exc})"
                    ) from exc
            raise exc

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
        if self.provider == "groq":
            groq_client = self._get_groq_client()
            if groq_client is not None:
                try:
                    async for chunk in groq_client.stream_chat(request):
                        yield chunk
                    return
                except Exception as exc:
                    logger.warning("Groq stream_chat failed: %s", exc)
                    if self.fallback_provider != "ollama":
                        raise OllamaModelError(f"Groq request failed: {exc}") from exc
            elif self.fallback_provider != "ollama":
                raise OllamaModelError(
                    "Groq is the selected provider but GROQ_API_KEY is not configured."
                )

            logger.warning("Falling back from Groq to Ollama for stream_chat.")

        use_fallback = False
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
            logger.warning(
                "Ollama stream_chat failed: %s. Falling back to Groq...", exc
            )
            use_fallback = True
            fallback_exc = exc

        if use_fallback:
            groq_client = self._get_groq_client()
            if groq_client:
                try:
                    async for chunk in groq_client.stream_chat(request):
                        yield chunk
                except Exception as groq_exc:
                    logger.error("Groq fallback stream_chat failed: %s", groq_exc)
                    raise OllamaModelError(
                        f"Ollama failed ({fallback_exc}) and Groq fallback failed ({groq_exc})"
                    ) from fallback_exc
            else:
                raise OllamaModelError(str(fallback_exc)) from fallback_exc

    async def generate(
        self,
        request: GenerateRequest,
    ) -> ModelResponse:
        if self.provider == "groq":
            groq_client = self._get_groq_client()
            if groq_client is not None:
                try:
                    return await groq_client.generate(request)
                except Exception as exc:
                    logger.warning("Groq generate failed: %s", exc)
                    if self.fallback_provider != "ollama":
                        raise OllamaModelError(f"Groq request failed: {exc}") from exc
            elif self.fallback_provider != "ollama":
                raise OllamaModelError(
                    "Groq is the selected provider but GROQ_API_KEY is not configured."
                )

            logger.warning("Falling back from Groq to Ollama for generate.")
            return await self._with_retry(self._generate, request)

        try:
            return await self._with_retry(self._generate, request)
        except OllamaModelError as exc:
            logger.warning("Ollama generate failed: %s. Falling back to Groq...", exc)
            groq_client = self._get_groq_client()
            if groq_client:
                try:
                    return await groq_client.generate(request)
                except Exception as groq_exc:
                    logger.error("Groq fallback generate failed: %s", groq_exc)
                    raise OllamaModelError(
                        f"Ollama failed ({exc}) and Groq fallback failed ({groq_exc})"
                    ) from exc
            raise exc

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
        if self.provider == "groq":
            groq_client = self._get_groq_client()
            if groq_client is not None:
                try:
                    async for chunk in groq_client.stream_generate(request):
                        yield chunk
                    return
                except Exception as exc:
                    logger.warning("Groq stream_generate failed: %s", exc)
                    if self.fallback_provider != "ollama":
                        raise OllamaModelError(f"Groq request failed: {exc}") from exc
            elif self.fallback_provider != "ollama":
                raise OllamaModelError(
                    "Groq is the selected provider but GROQ_API_KEY is not configured."
                )

            logger.warning("Falling back from Groq to Ollama for stream_generate.")

        use_fallback = False
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
            logger.warning(
                "Ollama stream_generate failed: %s. Falling back to Groq...", exc
            )
            use_fallback = True
            fallback_exc = exc

        if use_fallback:
            groq_client = self._get_groq_client()
            if groq_client:
                try:
                    async for chunk in groq_client.stream_generate(request):
                        yield chunk
                except Exception as groq_exc:
                    logger.error("Groq fallback stream_generate failed: %s", groq_exc)
                    raise OllamaModelError(
                        f"Ollama failed ({fallback_exc}) and Groq fallback failed ({groq_exc})"
                    ) from fallback_exc
            else:
                raise OllamaModelError(str(fallback_exc)) from fallback_exc

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
                    delay = min(_BASE_DELAY * (2**attempt), _MAX_DELAY)
                    logger.warning(
                        "Ollama request failed (attempt %d/%d), retrying in %.1fs: %s",
                        attempt + 1,
                        self._max_retries,
                        delay,
                        exc,
                    )
                    await asyncio.sleep(delay)
                else:
                    logger.error(
                        "Ollama request failed after %d attempts: %s",
                        self._max_retries,
                        exc,
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


def _provider_name(value: str) -> str:
    provider = value.strip().lower()
    if provider not in {"groq", "ollama", "none"}:
        logger.warning("Unknown AI provider '%s'; using Groq.", value)
        return "groq"
    return provider


# Backward-compatible alias
OllamaModelClient = AIModelClient
