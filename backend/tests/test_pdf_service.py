from __future__ import annotations

import tempfile

from app.services.pdf_service import extract_text_from_pdf


def test_extract_text_from_pdf_returns_string() -> None:
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp.write(_dummy_pdf_content())
        tmp_path = tmp.name

    text = extract_text_from_pdf(tmp_path)
    assert isinstance(text, str)


def test_extract_text_from_pdf_handles_invalid_pdf() -> None:
    import pytest

    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp.write(b"not a real pdf content")
        tmp_path = tmp.name

    with pytest.raises(Exception):
        extract_text_from_pdf(tmp_path)


def _dummy_pdf_content() -> bytes:
    return (
        b"%PDF-1.4\n"
        b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
        b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
        b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]\n"
        b"   /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n"
        b"4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 12 Tf 100 700 Td (Hello World) Tj ET\nendstream\nendobj\n"
        b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n"
        b"xref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000266 00000 n \n0000000363 00000 n \n"
        b"trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n406\n%%EOF"
    )
