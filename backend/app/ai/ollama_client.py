"""Compatibility shim for ollama_client import."""

from __future__ import annotations

from app.ai.client import AIModelClient, OllamaModelClient, OllamaModelError

__all__ = ["AIModelClient", "OllamaModelClient", "OllamaModelError"]
