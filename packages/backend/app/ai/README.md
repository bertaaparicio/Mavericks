# AI Module

Reusable helpers for querying a local Ollama model from backend endpoints.

## Configuration

The client reads only the model name from the environment:

```bash
OLLAMA_MODEL=gpt-oss:20b
```

Other settings are intentionally fixed to local defaults:

- host: `http://localhost:11434`
- timeout: `60`
- keep alive: `5m`

If `OLLAMA_MODEL` is not set, the module uses `gpt-oss:20b`.

Make sure Ollama is running and the model is available:

```bash
ollama serve
ollama pull gpt-oss:20b
```

## Chat Usage

```python
from app.ai import ChatMessage, ChatRequest, OllamaModelClient


async def ask_model(question: str) -> str:
    async with OllamaModelClient() as client:
        response = await client.chat(
            ChatRequest(
                system="Answer clearly and concisely.",
                messages=[
                    ChatMessage(role="user", content=question),
                ],
            )
        )

    return response.content
```

## Generate Usage

Use `generate` for a single prompt without chat history.

```python
from app.ai import GenerateRequest, OllamaModelClient


async def generate_summary(text: str) -> str:
    async with OllamaModelClient() as client:
        response = await client.generate(
            GenerateRequest(
                prompt=f"Summarize this text:\n\n{text}",
                options={"temperature": 0},
            )
        )

    return response.content
```

## Streaming

```python
from app.ai import ChatMessage, ChatRequest, OllamaModelClient


async def stream_answer(question: str):
    async with OllamaModelClient() as client:
        request = ChatRequest(
            messages=[ChatMessage(role="user", content=question)],
        )

        async for chunk in client.stream_chat(request):
            yield chunk
```

## Error Handling

All Ollama request and connection failures are wrapped in `OllamaModelError`.

```python
from app.ai import ChatMessage, ChatRequest, OllamaModelClient, OllamaModelError


async def safe_ask(question: str) -> str:
    try:
        async with OllamaModelClient() as client:
            response = await client.chat(
                ChatRequest(messages=[ChatMessage(role="user", content=question)])
            )
    except OllamaModelError as exc:
        return f"AI service unavailable: {exc}"

    return response.content
```

## Endpoint Pattern

Prefer one app-lifetime client for endpoints, then close it during application
shutdown.

```python
from app.ai import ChatMessage, ChatRequest, OllamaModelClient


ai_client = OllamaModelClient()


async def endpoint_handler(prompt: str) -> dict[str, str]:
    response = await ai_client.chat(
        ChatRequest(messages=[ChatMessage(role="user", content=prompt)])
    )

    return {"answer": response.content}


async def shutdown_handler() -> None:
    await ai_client.close()
```
