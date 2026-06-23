from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.ai.client import AIModelClient
from app.ai.schemas import ChatMessage, ChatRequest, ModelResponse


@pytest.mark.asyncio
async def test_groq_is_primary_provider() -> None:
    ollama = MagicMock()
    groq = MagicMock()
    groq.chat = AsyncMock(
        return_value=ModelResponse(model="groq-model", content="groq", raw={})
    )

    with patch.dict(
        "os.environ",
        {
            "AI_PROVIDER": "groq",
            "AI_FALLBACK_PROVIDER": "ollama",
            "GROQ_API_KEY": "test",
        },
    ):
        client = AIModelClient(client=ollama)
        client._groq_client = groq
        response = await client.chat(
            ChatRequest(messages=[ChatMessage(role="user", content="hello")])
        )

    assert response.content == "groq"
    groq.chat.assert_awaited_once()
    ollama.chat.assert_not_called()


@pytest.mark.asyncio
async def test_groq_failure_falls_back_to_ollama() -> None:
    ollama = MagicMock()
    ollama.chat = AsyncMock(
        return_value={
            "model": "ollama-model",
            "message": {"content": "ollama"},
        }
    )
    groq = MagicMock()
    groq.chat = AsyncMock(side_effect=RuntimeError("temporary Groq error"))

    with patch.dict(
        "os.environ",
        {
            "AI_PROVIDER": "groq",
            "AI_FALLBACK_PROVIDER": "ollama",
            "GROQ_API_KEY": "test",
        },
    ):
        client = AIModelClient(client=ollama)
        client._groq_client = groq
        response = await client.chat(
            ChatRequest(messages=[ChatMessage(role="user", content="hello")])
        )

    assert response.content == "ollama"
    groq.chat.assert_awaited_once()
    ollama.chat.assert_awaited_once()
