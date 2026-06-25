from __future__ import annotations

from unittest.mock import MagicMock, patch
import pytest

from app.services.database_service import DatabaseConnection, query_jobs_structured


@pytest.fixture(autouse=True)
def mock_psycopg2_connect():
    with patch("psycopg2.connect") as mock:
        yield mock


def test_rank_results_single_field_match() -> None:
    db = DatabaseConnection()
    rows = [
        {
            "job_title": "Engineer",
            "company_name": "C1",
            "location": "Barcelona",
            "seniority_level": "Senior",
            "job_function": "Engineering",
            "employment_type": "Full-time",
            "industry": "Tech",
        },
    ]
    result = db._rank_results(
        rows,
        job_title_keywords=["Engineer"],
        seniority_level="Senior",
    )
    assert result[0]["match_score"] == 15  # 10 (seniority) + 5 (keyword)
    assert result[0]["match_ratio"] > 0


def test_rank_results_no_match() -> None:
    db = DatabaseConnection()
    rows = [
        {
            "job_title": "Doctor",
            "company_name": "C1",
            "location": "Madrid",
            "seniority_level": "Entry",
            "job_function": "Healthcare",
            "employment_type": "Part-time",
            "industry": "Health",
        },
    ]
    result = db._rank_results(
        rows,
        job_title_keywords=["Engineer"],
        seniority_level="Senior",
    )
    assert result[0]["match_score"] == 0
    assert result[0]["match_ratio"] == 0.0


def test_rank_results_full_match() -> None:
    db = DatabaseConnection()
    rows = [
        {
            "job_title": "Senior Engineer ML",
            "company_name": "C1",
            "location": "Barcelona",
            "seniority_level": "Senior",
            "job_function": "Engineering",
            "employment_type": "Full-time",
            "industry": "Technology",
        },
    ]
    result = db._rank_results(
        rows,
        job_title_keywords=["Engineer", "ML"],
        seniority_level="Senior",
        location="Barcelona",
        job_function="Engineering",
        industry="Technology",
        employment_type="Full-time",
    )
    assert result[0]["match_score"] == 60  # 5 fields * 10 + 2 keywords * 5
    assert result[0]["match_ratio"] == 100.0


def test_rank_multiple_rows_sorted() -> None:
    db = DatabaseConnection()
    rows = [
        {
            "job_title": "Junior Dev",
            "company_name": "C1",
            "location": "Madrid",
            "seniority_level": "Entry",
            "job_function": "Engineering",
            "employment_type": "Full-time",
            "industry": "Tech",
        },
        {
            "job_title": "Senior Engineer",
            "company_name": "C2",
            "location": "Barcelona",
            "seniority_level": "Senior",
            "job_function": "Engineering",
            "employment_type": "Full-time",
            "industry": "Tech",
        },
    ]
    result = db._rank_results(
        rows,
        job_title_keywords=["Engineer"],
        seniority_level="Senior",
        location="Barcelona",
    )
    assert result[0]["job_title"] == "Senior Engineer"
    assert result[0]["match_score"] >= result[1]["match_score"]


@patch("app.services.database_service.DatabaseConnection")
def test_query_jobs_structured_empty(mock_db: MagicMock) -> None:
    instance = mock_db.return_value
    instance.search_jobs.return_value = []

    result = query_jobs_structured(job_title_keywords=["Engineer"])
    assert result == []


@patch("app.services.database_service.DatabaseConnection")
def test_query_jobs_structured_with_results(mock_db: MagicMock) -> None:
    mock_rows = [
        {
            "job_title": "Engineer",
            "company_name": "C1",
            "location": "Barcelona",
            "seniority_level": "Senior",
            "job_function": "Engineering",
            "employment_type": "Full-time",
            "industry": "Tech",
            "match_score": 50,
            "match_ratio": 100.0,
        },
    ]
    instance = mock_db.return_value
    instance.search_jobs.return_value = mock_rows

    result = query_jobs_structured(job_title_keywords=["Engineer"])
    assert len(result) == 1
    assert result[0]["job_title"] == "Engineer"
    assert result[0]["match_score"] == 50
    assert result[0]["match_ratio"] == 100.0
