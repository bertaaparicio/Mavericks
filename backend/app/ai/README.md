# AI Module

Reusable async helpers for querying AI models.

Groq is the primary provider. Ollama is preserved as a configurable fallback.

## Model Configuration

```bash
AI_PROVIDER=groq
AI_FALLBACK_PROVIDER=ollama
GROQ_API_KEY=your_key_here
GROQ_MODEL=openai/gpt-oss-20b
OLLAMA_MODEL=gpt-oss:20b
```

For Docker, copy `.env.template` to `.env` at the repository root and add the
real Groq key. Never commit `.env`. For a direct local execution, export the
same variables in the shell before starting `run.py`.

## Ollama fallback

Ollama remains available if Groq is unavailable:

```bash
ollama serve
ollama pull gpt-oss:20b
```

To use Ollama as the primary provider again:

```bash
AI_PROVIDER=ollama
AI_FALLBACK_PROVIDER=groq
```

## Usage

```python
from app.ai import ChatMessage, ChatRequest, AIModelClient


async def ask_model(question: str) -> str:
    async with AIModelClient() as client:
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

## Generate

Use `generate` for a single prompt without chat history.

```python
from app.ai import GenerateRequest, AIModelClient


async def generate_summary(text: str) -> str:
    async with AIModelClient() as client:
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
from app.ai import ChatMessage, ChatRequest, AIModelClient


async def stream_answer(question: str):
    async with AIModelClient() as client:
        request = ChatRequest(
            messages=[ChatMessage(role="user", content=question)],
        )

        async for chunk in client.stream_chat(request):
            yield chunk
```

## Error Handling

All AI request and connection failures are wrapped in `OllamaModelError`.

```python
from app.ai import ChatMessage, ChatRequest, AIModelClient, OllamaModelError


async def safe_ask(question: str) -> str:
    try:
        async with AIModelClient() as client:
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
from app.ai import ChatMessage, ChatRequest, AIModelClient


ai_client = AIModelClient()


async def endpoint_handler(prompt: str) -> dict[str, str]:
    response = await ai_client.chat(
        ChatRequest(messages=[ChatMessage(role="user", content=prompt)])
    )

    return {"answer": response.content}


async def shutdown_handler() -> None:
    await ai_client.close()
```
