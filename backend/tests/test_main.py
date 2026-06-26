from __future__ import annotations

from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient

client = TestClient(TestClient)


@patch(
    "app.main._search_jobs",
    return_value=[
        MagicMock(
            job_title="Engineer",
            company_name="C1",
            location="Barcelona",
            seniority_level="Senior",
            job_function="Engineering",
            employment_type="Full-time",
            industry="Tech",
            match_score=50,
            match_ratio=100.0,
            model_dump=lambda: {"job_title": "Engineer", "match_ratio": 100.0},
        )
    ],
)
@patch("app.main.AIModelClient")
def test_health_endpoint(mock_ollama: MagicMock, mock_search: MagicMock) -> None:
    from app.main import app

    test_client = TestClient(app)
    response = test_client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@patch.dict(
    "os.environ",
    {
        "AI_PROVIDER": "groq",
        "AI_FALLBACK_PROVIDER": "ollama",
        "GROQ_MODEL": "openai/gpt-oss-20b",
        "GROQ_API_KEY": "test-key",
    },
)
def test_ai_health_endpoint() -> None:
    from app.main import app

    test_client = TestClient(app)
    response = test_client.get("/health/ai")
    assert response.status_code == 200
    assert response.json() == {
        "status": "configured",
        "provider": "groq",
        "model": "openai/gpt-oss-20b",
        "fallback_provider": "ollama",
        "api_key_configured": True,
    }


@patch("app.main._search_jobs", return_value=[])
@patch("app.main.AIModelClient")
def test_match_cv_no_file(mock_ollama: MagicMock, mock_search: MagicMock) -> None:
    from app.main import app

    test_client = TestClient(app)
    response = test_client.post("/match-cv")
    assert response.status_code == 422


@patch("app.main._search_jobs", return_value=[])
@patch("app.main.AIModelClient")
def test_cv_qa_init_no_file(mock_ollama: MagicMock, mock_search: MagicMock) -> None:
    from app.main import app

    test_client = TestClient(app)
    response = test_client.post("/cv-qa/init")
    assert response.status_code == 422


@patch("app.main._search_jobs", return_value=[])
@patch("app.main.get_qa_service")
def test_cv_qa_init_success(mock_get_qa: MagicMock, mock_search: MagicMock) -> None:
    from unittest.mock import AsyncMock
    from app.main import app
    from app.services.qa_service import QASession

    mock_session = QASession("dummy cv text")
    mock_session.session_id = "test-session-123"
    mock_session.current_question = "What is your desired role?"

    mock_qa_service = MagicMock()
    mock_qa_service.init_session = AsyncMock(return_value=mock_session)
    mock_get_qa.return_value = mock_qa_service

    test_client = TestClient(app)

    pdf_bytes = b"%PDF-1.4\n..."

    with patch("app.services.cv_reader.extract_text", return_value=("dummy cv text", {})):
        response = test_client.post(
            "/cv-qa/init",
            files={"file": ("cv.pdf", pdf_bytes, "application/pdf")},
            data={"language": "es"}
        )

    assert response.status_code == 200
    assert response.json() == {
        "session_id": "test-session-123",
        "question": "What is your desired role?"
    }


@patch("app.main._search_jobs", return_value=[])
@patch("app.main.AIModelClient")
def test_cv_qa_answer_no_session(
    mock_ollama: MagicMock, mock_search: MagicMock
) -> None:
    from app.main import app

    test_client = TestClient(app)
    response = test_client.post(
        "/cv-qa/answer", json={"session_id": "nonexistent", "answer": "test"}
    )
    assert response.status_code == 404


@patch("app.main._search_jobs", return_value=[])
@patch("app.main.AIModelClient")
def test_cv_qa_status_not_found(mock_ollama: MagicMock, mock_search: MagicMock) -> None:
    from app.main import app

    test_client = TestClient(app)
    response = test_client.get("/cv-qa/nonexistent")
    assert response.status_code == 404


@patch("app.main._search_jobs", return_value=[])
@patch("app.main.AIModelClient")
def test_cors_headers(mock_ollama: MagicMock, mock_search: MagicMock) -> None:
    from app.main import app

    test_client = TestClient(app)
    response = test_client.options(
        "/health",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers


@patch("app.main._search_jobs", return_value=[])
@patch("app.main.AIModelClient")
def test_match_from_profile_empty(
    mock_ollama: MagicMock, mock_search: MagicMock
) -> None:
    from app.main import app

    test_client = TestClient(app)
    response = test_client.post("/match-from-profile", json={})
    assert response.status_code == 200
    assert response.json()["ranked_jobs"] == []


@patch("app.main._search_jobs")
@patch("app.main.AIModelClient")
def test_match_from_profile_with_params(
    mock_ollama: MagicMock, mock_search: MagicMock
) -> None:
    from app.main import JobMatchResult

    mock_search.return_value = [
        JobMatchResult(
            job_title="Engineer",
            company_name="C1",
            location="Barcelona",
            seniority_level="Senior",
            job_function="Engineering",
            employment_type="Full-time",
            industry="Tech",
            match_score=50,
            match_ratio=100.0,
        ),
    ]
    from app.main import app

    test_client = TestClient(app)
    response = test_client.post(
        "/match-from-profile",
        json={
            "job_title_keywords": ["Engineer"],
            "seniority_level": "Senior",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["ranked_jobs"]) == 1
    assert data["ranked_jobs"][0]["job_title"] == "Engineer"
    assert data["ranked_jobs"][0]["match_ratio"] == 100.0
