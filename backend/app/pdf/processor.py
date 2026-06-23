"""Utilities for extracting and chunking PDF text."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import BinaryIO

from langchain_text_splitters import CharacterTextSplitter
from PyPDF2 import PdfReader
from PyPDF2.errors import PdfReadError


DEFAULT_CHUNK_SIZE = 3000
DEFAULT_CHUNK_OVERLAP = 300
DEFAULT_SEPARATOR = "\n\n"


class PDFProcessingError(RuntimeError):
    """Raised when a PDF cannot be read or processed."""


@dataclass(frozen=True, slots=True)
class PDFTextExtraction:
    """Text extracted from a PDF with basic document metadata."""

    text: str
    page_count: int
    source: str | None = None


@dataclass(frozen=True, slots=True)
class PDFTextChunk:
    """A chunk of PDF text ready to send to an AI model."""

    index: int
    content: str
    source: str | None = None


class PDFTextProcessor:
    """Extract PDF text and split it into model-friendly chunks."""

    def __init__(
        self,
        chunk_size: int = DEFAULT_CHUNK_SIZE,
        chunk_overlap: int = DEFAULT_CHUNK_OVERLAP,
        separator: str = DEFAULT_SEPARATOR,
    ) -> None:
        self._splitter = CharacterTextSplitter(
            separator=separator,
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )

    def extract_text(self, pdf: str | Path | BinaryIO) -> PDFTextExtraction:
        """Extract text from a file path or binary PDF stream."""

        source = _source_name(pdf)

        try:
            reader = PdfReader(pdf)
            pages = [page.extract_text() or "" for page in reader.pages]
        except (OSError, PdfReadError, ValueError) as exc:
            message = f"Could not read PDF: {source or 'stream'}"
            raise PDFProcessingError(message) from exc

        text = DEFAULT_SEPARATOR.join(page.strip() for page in pages if page.strip())

        return PDFTextExtraction(
            text=text,
            page_count=len(reader.pages),
            source=source,
        )

    def split_text(
        self,
        text: str,
        source: str | None = None,
    ) -> list[PDFTextChunk]:
        """Split extracted PDF text into ordered chunks."""

        chunks = self._splitter.split_text(text)

        return [
            PDFTextChunk(index=index, content=chunk, source=source)
            for index, chunk in enumerate(chunks)
            if chunk.strip()
        ]

    def process(self, pdf: str | Path | BinaryIO) -> list[PDFTextChunk]:
        """Extract and split a PDF in one call."""

        extraction = self.extract_text(pdf)

        return self.split_text(
            extraction.text,
            source=extraction.source,
        )


def _source_name(pdf: str | Path | BinaryIO) -> str | None:
    if isinstance(pdf, str | Path):
        return str(pdf)

    return getattr(pdf, "name", None)
