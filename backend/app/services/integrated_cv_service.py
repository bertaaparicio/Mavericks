"""Integrated CV flow: extraction, Groq analysis, checklist and job matching."""

from __future__ import annotations

import json
import logging
from typing import Any

from app.ai.ollama_client import AIModelClient
from app.ai.schemas import ChatMessage, ChatRequest
from app.services.database_service import query_jobs_structured
from app.services.profile_parser import parse_cv_profile
from backend.services.checklist_service import build_checklist
from backend.services.cv_reader import analyse_cv, extract_text


logger = logging.getLogger(__name__)

PROFILE_PROMPT = """You are TalentMatch AI's CV analysis agent.

Analyze the CV and return ONLY one valid JSON object:
{{
  "matching_profile": {{
    "job_title_keywords": ["..."],
    "seniority_level": "...",
    "location": "...",
    "job_function": "...",
    "industry": "...",
    "employment_type": "..."
  }},
  "candidate_fields": {{
    "identity.current_location": {{"value": "...", "confidence": 0.0}},
    "identity.preferred_workday": {{"value": "...", "confidence": 0.0}},
    "professional_profile.primary_role": {{"value": "...", "confidence": 0.0}},
    "professional_profile.years_experience": {{"value": "...", "confidence": 0.0}},
    "professional_profile.seniority": {{"value": "...", "confidence": 0.0}},
    "professional_profile.sectors": {{"value": "...", "confidence": 0.0}},
    "professional_profile.main_responsibilities": {{"value": ["..."], "confidence": 0.0}},
    "skills.technical_skills": {{"value": ["..."], "confidence": 0.0}},
    "skills.tools": {{"value": ["..."], "confidence": 0.0}},
    "skills.soft_skills": {{"value": ["..."], "confidence": 0.0}},
    "skills.certifications": {{"value": ["..."], "confidence": 0.0}},
    "education.highest_level": {{"value": "...", "confidence": 0.0}},
    "education.degrees": {{"value": ["..."], "confidence": 0.0}},
    "education.education_center": {{"value": "...", "confidence": 0.0}},
    "education.specialization": {{"value": "...", "confidence": 0.0}},
    "education.graduation_date": {{"value": "...", "confidence": 0.0}},
    "education.ongoing_education": {{"value": "...", "confidence": 0.0}},
    "languages.languages": {{"value": ["..."], "confidence": 0.0}},
    "languages.language_levels": {{"value": ["..."], "confidence": 0.0}}
  }}
}}

Rules:
- Omit fields whose answer is not present or strongly supported by the CV.
- Never infer future preferences from past employment.
- Confidence must be between 0 and 1.
- Keep values concise.
- Use the CV language where possible.

CV TEXT:
{cv_text}
"""


async def analyze_cv_and_match(
    *,
    filename: str,
    content: bytes,
    language: str,
    plan: str,
) -> dict[str, Any]:
    """Run the complete first-agent flow and return the frontend contract."""

    language = language if language in {"ca", "es", "en"} else "ca"
    plan = plan if plan in {"free", "pro"} else "free"

    text, _ = extract_text(filename, content, language)
    base = analyse_cv(filename, content, language)
    heuristic_profile = _profile_from_checklist(base["checklist"])

    llm_result = await _analyze_with_llm(text)
    llm_fields = _normalize_candidate_fields(llm_result.get("candidate_fields"))
    merged_profile = _merge_profiles(heuristic_profile, llm_fields)
    base["checklist"] = build_checklist(merged_profile, language)

    matching_profile = _normalize_matching_profile(
        llm_result.get("matching_profile"),
        merged_profile,
    )
    jobs = _search_jobs(matching_profile)

    base["plan"] = plan
    base["matching_profile"] = matching_profile
    base["ranked_jobs"] = jobs
    base["llm"] = {
        "provider": "groq",
        "model": llm_result.get("_model", ""),
        "fields_detected": len(llm_fields),
    }
    if plan != "pro":
        base["cv_improvement"] = None
    return base


def match_after_answers(
    *,
    matching_profile: dict[str, Any],
    answers: dict[str, Any],
) -> list[dict[str, Any]]:
    """Update searchable fields with checklist answers and rerun PostgreSQL."""

    profile = dict(matching_profile)
    desired_role = answers.get("career_goal.desired_role")
    primary_role = answers.get("professional_profile.primary_role")

    # if desired_role or primary_role:
    #     profile["job_title_keywords"] = _as_list(desired_role or primary_role)

    # Combinar las keywords originales con las nuevas respuestas del usuario
    old_keywords = profile.get("job_title_keywords") or []
    new_keywords = _as_list(desired_role or primary_role) or []
    
    # Unir ambas listas y quitar duplicados usando set()
    combined = list(set(old_keywords + new_keywords))
    if combined:
        profile["job_title_keywords"] = combined

    profile["seniority_level"] = (
        answers.get("professional_profile.seniority")
        or profile.get("seniority_level")
    )
    profile["location"] = (
        answers.get("identity.current_location")
        or profile.get("location")
    )
    profile["industry"] = (
        answers.get("career_goal.desired_sector")
        or answers.get("professional_profile.sectors")
        or profile.get("industry")
    )
    profile["employment_type"] = (
        answers.get("employment_conditions.contract_type")
        or answers.get("identity.preferred_workday")
        or profile.get("employment_type")
    )
    return _search_jobs(profile)


async def _analyze_with_llm(text: str) -> dict[str, Any]:
    request = ChatRequest(
        messages=[
            ChatMessage(
                role="user",
                content=PROFILE_PROMPT.format(cv_text=text[:24000]),
            )
        ],
        options={"temperature": 0, "max_completion_tokens": 1800},
        format="json",
    )
    async with AIModelClient() as client:
        response = await client.chat(request)

    try:
        parsed = json.loads(response.content)
    except json.JSONDecodeError:
        logger.warning("Groq returned invalid integrated profile JSON.")
        parsed = {"matching_profile": parse_cv_profile(response.content)}
    parsed["_model"] = response.model
    return parsed


def _profile_from_checklist(checklist: dict[str, Any]) -> dict[str, dict[str, Any]]:
    profile = {}
    for section in checklist.get("sections", []):
        for field in section.get("fields", []):
            if field.get("value") not in (None, "", []):
                profile[field["key"]] = {
                    "value": field["value"],
                    "confidence": field.get("confidence", 0),
                    "source": field.get("source") or "cv",
                }
    return profile


def _normalize_candidate_fields(value: Any) -> dict[str, dict[str, Any]]:
    if not isinstance(value, dict):
        return {}
    normalized = {}
    for key, detected in value.items():
        if not isinstance(detected, dict):
            continue
        field_value = detected.get("value")
        if field_value in (None, "", []):
            continue
        try:
            confidence = max(0.0, min(1.0, float(detected.get("confidence", 0.75))))
        except (TypeError, ValueError):
            confidence = 0.75
        normalized[key] = {
            "value": field_value,
            "confidence": round(confidence, 2),
            "source": "groq",
        }
    return normalized


def _merge_profiles(
    heuristics: dict[str, dict[str, Any]],
    llm_fields: dict[str, dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    merged = dict(heuristics)
    for key, detected in llm_fields.items():
        current = merged.get(key)
        if current is None or detected["confidence"] >= current.get("confidence", 0):
            merged[key] = detected
    return merged


def _normalize_matching_profile(
    value: Any,
    candidate_fields: dict[str, dict[str, Any]],
) -> dict[str, Any]:
    profile = value if isinstance(value, dict) else {}
    role = _field(candidate_fields, "professional_profile.primary_role")
    sectors = _field(candidate_fields, "professional_profile.sectors")
    return {
        "job_title_keywords": _as_list(profile.get("job_title_keywords") or role),
        "seniority_level": profile.get("seniority_level")
        or _field(candidate_fields, "professional_profile.seniority"),
        "location": profile.get("location")
        or _field(candidate_fields, "identity.current_location"),
        "job_function": profile.get("job_function"),
        "industry": profile.get("industry") or sectors,
        "employment_type": profile.get("employment_type")
        or _field(candidate_fields, "identity.preferred_workday"),
    }


def _search_jobs(profile: dict[str, Any]) -> list[dict[str, Any]]:
    try:
        return query_jobs_structured(
            job_title_keywords=_as_list(profile.get("job_title_keywords")),
            seniority_level=profile.get("seniority_level"),
            location=profile.get("location"),
            job_function=profile.get("job_function"),
            industry=profile.get("industry"),
            employment_type=profile.get("employment_type"),
        )
    except Exception as exc:
        logger.warning("Integrated database search failed: %s", exc)
        return []


def _field(profile: dict[str, dict[str, Any]], key: str) -> Any:
    detected = profile.get(key)
    return detected.get("value") if detected else None


def _as_list(value: Any) -> list[str] | None:
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()] or None
    if isinstance(value, str):
        return [item.strip() for item in value.split(",") if item.strip()] or None
    return None
