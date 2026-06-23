"""Configuration helpers for local Ollama-backed AI clients."""

from __future__ import annotations

import os
from dataclasses import dataclass


DEFAULT_OLLAMA_HOST = "http://localhost:11434"
DEFAULT_OLLAMA_MODEL = "llama2:latest"
DEFAULT_OLLAMA_TIMEOUT = 600.0
DEFAULT_OLLAMA_KEEP_ALIVE = "5m"


@dataclass(frozen=True, slots=True)
class OllamaSettings:
    """Runtime settings for an Ollama client."""

    model: str = DEFAULT_OLLAMA_MODEL
    host: str = DEFAULT_OLLAMA_HOST
    timeout: float | None = DEFAULT_OLLAMA_TIMEOUT
    keep_alive: str | int | None = DEFAULT_OLLAMA_KEEP_ALIVE

    @classmethod
    def from_env(cls) -> "OllamaSettings":
        """Build settings from the environment for local or Docker execution."""

        return cls(
            model=os.getenv("OLLAMA_MODEL") or DEFAULT_OLLAMA_MODEL,
            host=os.getenv("OLLAMA_HOST") or DEFAULT_OLLAMA_HOST,
        )
