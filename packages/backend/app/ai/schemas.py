"""Shared data structures for AI model requests and responses."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Literal

MessageRole = Literal["system", "user", "assistant", "tool"]


@dataclass(frozen=True, slots=True)
class ChatMessage:
    """A chat message in Ollama's expected role/content format."""

    role: MessageRole
    content: str
    images: list[str] | None = None

    def to_ollama(self) -> dict[str, Any]:
        message: dict[str, Any] = {"role": self.role, "content": self.content}

        if self.images:
            message["images"] = self.images

        return message


@dataclass(frozen=True, slots=True)
class ChatRequest:
    """Input for a model chat request."""

    messages: list[ChatMessage]
    model: str | None = None
    system: str | None = None
    options: dict[str, Any] = field(default_factory=dict)
    format: str | dict[str, Any] | None = None


@dataclass(frozen=True, slots=True)
class GenerateRequest:
    """Input for a single-prompt generation request."""

    prompt: str
    model: str | None = None
    system: str | None = None
    options: dict[str, Any] = field(default_factory=dict)
    format: str | dict[str, Any] | None = None


@dataclass(frozen=True, slots=True)
class ModelResponse:
    """Normalized response returned by the AI service."""

    model: str
    content: str
    raw: dict[str, Any]
