# PDF Module

Reusable helpers for extracting text from PDF files and splitting it into chunks
that can be sent to the AI module.

## Usage

```python
from app.ai import ChatMessage, ChatRequest, OllamaModelClient
from app.pdf import PDFTextProcessor


async def ask_about_pdf(pdf_path: str, question: str) -> str:
    processor = PDFTextProcessor()
    chunks = processor.process(pdf_path)
    context = "\n\n---\n\n".join(chunk.content for chunk in chunks[:4])

    async with OllamaModelClient() as client:
        response = await client.chat(
            ChatRequest(
                system="Answer using only the provided PDF content.",
                messages=[
                    ChatMessage(
                        role="user",
                        content=f"PDF content:\n\n{context}\n\nQuestion: {question}",
                    )
                ],
            )
        )

    return response.content
```
