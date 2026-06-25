from __future__ import annotations

from app.services.profile_parser import parse_cv_profile


def test_parse_json_block() -> None:
    text = '```json\n{"job_title_keywords": ["Engineer", "ML"], "seniority_level": "Senior"}\n```'
    result = parse_cv_profile(text)
    assert result["job_title_keywords"] == ["Engineer", "ML"]
    assert result["seniority_level"] == "Senior"


def test_parse_inline_json() -> None:
    text = 'Some text {"job_title_keywords": ["Data Scientist"], "location": "Barcelona"} more text'
    result = parse_cv_profile(text)
    assert result["job_title_keywords"] == ["Data Scientist"]
    assert result["location"] == "Barcelona"


def test_parse_yaml_block() -> None:
    text = (
        "```yaml\njob_title_keywords: Engineer, Manager\nseniority_level: Senior\n```"
    )
    result = parse_cv_profile(text)
    assert "Engineer" in result["job_title_keywords"]
    assert "Manager" in result["job_title_keywords"]
    assert result["seniority_level"] == "Senior"


def test_parse_key_value_text() -> None:
    text = (
        "CV Profile Analysis:\n"
        "job_title_keywords: Software Engineer, Python\n"
        "seniority_level: Mid-Senior\n"
        "location: Remote\n"
        "job_function: Engineering\n"
    )
    result = parse_cv_profile(text)
    assert "Software Engineer" in result["job_title_keywords"]
    assert "Python" in result["job_title_keywords"]
    assert result["seniority_level"] == "Mid-Senior"
    assert result["location"] == "Remote"
    assert result["job_function"] == "Engineering"


def test_parse_empty_text() -> None:
    result = parse_cv_profile("No structured information here")
    assert result["job_title_keywords"] is None
    assert result["seniority_level"] is None


def test_parse_mixed_case_keys() -> None:
    text = "Job_Title_Keywords: Architect\nSeniority_Level: Director"
    result = parse_cv_profile(text)
    assert result["job_title_keywords"] == ["Architect"]
    assert result["seniority_level"] == "Director"


def test_parse_partial_profile() -> None:
    text = "industry: Technology\nemployment_type: Full-time"
    result = parse_cv_profile(text)
    assert result["industry"] == "Technology"
    assert result["employment_type"] == "Full-time"
    assert result["job_title_keywords"] is None
