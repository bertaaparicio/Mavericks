"""Integrated CV flow: extraction, Groq analysis, checklist and job matching."""

from __future__ import annotations

import json
import logging
from typing import Any

from app.ai.ollama_client import AIModelClient
from app.ai.schemas import ChatMessage, ChatRequest
from app.services.database_service import query_jobs_structured
from app.services.profile_parser import parse_cv_profile
from app.services.checklist_service import build_checklist
from app.services.cv_reader import analyse_cv, extract_text


logger = logging.getLogger(__name__)

# Agent 1: prompt principal del lector de CV.
# Aquest agent transforma el text del CV en dos blocs:
# - candidate_fields: camps del checklist que es poden respondre amb el CV.
# - matching_profile: perfil compacte per consultar la base de dades d'ofertes.
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


# Agent 2: prompt del recomanador d'ofertes.
# Aquest agent rep les feines ja rankejades per la DB i redacta una explicació
# humana, creativa i amb emojis de per què encaixa cada oferta.
MATCH_EXPLANATION_PROMPT = """You are TalentMatch AI's Job Match Storyteller agent.

Your mission is to explain job matches in a warm, useful and creative way.
The tone must feel fresh, motivating and human — not corporate, not robotic.
Use emojis naturally in every explanation.

Language: {language}
User plan: {plan}

Candidate matching profile:
{candidate_profile}

Ranked jobs:
{jobs}

Return ONLY one valid JSON object with this shape:
{{
  "matches": [
    {{
      "index": 0,
      "why_it_fits": "🎯 ...",
      "strengths": ["💪 ...", "🚀 ..."],
      "missing": ["🧩 ..."],
      "final_tip": "✨ ..."
    }}
  ]
}}

Rules:
- Keep each text short and easy to read.
- Be encouraging, but do not invent skills the candidate does not have.
- Base the explanation only on the candidate profile and job fields provided.
- "why_it_fits" must be one sentence.
- "strengths" must have 2 short bullets.
- For FREE users, "missing" must be an empty list.
- For PRO users, "missing" can include up to 2 useful gaps or improvements.
- "final_tip" must sound like friendly coaching, not a formal report.
- Use the same language specified in Language.
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

    # Agent 1 - Pas 1: llegir el fitxer del CV i extreure'n el text.
    text, _ = extract_text(filename, content, language)

    # Agent 1 - Pas 2: fer una lectura heurística ràpida.
    # Això ens dona un fallback si el LLM no troba algun camp.
    base = analyse_cv(filename, content, language)
    heuristic_profile = _profile_from_checklist(base["checklist"])

    # Agent 1 - Pas 3: enviar el text del CV a Groq/Ollama via AIModelClient.
    # El resultat esperat és JSON estructurat, no text lliure.
    llm_result = await _analyze_with_llm(text)
    llm_fields = _normalize_candidate_fields(llm_result.get("candidate_fields"))

    # Agent 1 - Pas 4: fusionar el que ha trobat el LLM amb les heurístiques.
    # Si el LLM té més confiança, substitueix el valor heurístic.
    merged_profile = _merge_profiles(heuristic_profile, llm_fields)

    # Agent 1 - Pas 5: completar el checklist.
    # Els camps que quedin buits són els que després es preguntaran a l'usuari.
    base["checklist"] = build_checklist(merged_profile, language)

    # Agent 1 - Pas 6: construir el perfil que necessita l'Agent 2 / motor de matching.
    matching_profile = _normalize_matching_profile(
        llm_result.get("matching_profile"),
        merged_profile,
    )

    # Agent 2 - Pas 1: consulta/ranking contra PostgreSQL.
    jobs = _search_jobs(matching_profile)

    # Agent 2 - Pas 2: afegir una explicació creativa amb emojis a cada oferta.
    jobs = await _explain_job_matches(matching_profile, jobs, language, plan)

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


async def match_after_answers(
    *,
    matching_profile: dict[str, Any],
    answers: dict[str, Any],
    language: str = "ca",
    plan: str = "free",
) -> list[dict[str, Any]]:
    """Update searchable fields with checklist answers and rerun PostgreSQL."""

    # Agent 1 bis: quan l'usuari respon preguntes pendents del checklist,
    # actualitzem el matching_profile abans de tornar a buscar ofertes.
    profile = dict(matching_profile)
    desired_role = answers.get("career_goal.desired_role")
    primary_role = answers.get("professional_profile.primary_role")
    if desired_role or primary_role:
        profile["job_title_keywords"] = _as_list(desired_role or primary_role)

    profile["seniority_level"] = answers.get(
        "professional_profile.seniority"
    ) or profile.get("seniority_level")
    profile["location"] = answers.get("identity.current_location") or profile.get(
        "location"
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
    jobs = _search_jobs(profile)
    return await _explain_job_matches(profile, jobs, language, plan)


async def _explain_job_matches(
    profile: dict[str, Any],
    jobs: list[dict[str, Any]],
    language: str,
    plan: str,
) -> list[dict[str, Any]]:
    # Agent 2 - Crida LLM: converteix el ranking numèric en explicacions
    # motivadores, amb emojis i adaptades al pla Free/PRO.
    if not jobs:
        return jobs

    compact_jobs = [
        {
            "index": index,
            "job_title": job.get("job_title"),
            "company_name": job.get("company_name"),
            "location": job.get("location"),
            "seniority_level": job.get("seniority_level"),
            "job_function": job.get("job_function"),
            "employment_type": job.get("employment_type"),
            "industry": job.get("industry"),
            "match_ratio": job.get("match_ratio"),
        }
        for index, job in enumerate(jobs[:10])
    ]

    request = ChatRequest(
        messages=[
            ChatMessage(
                role="user",
                content=MATCH_EXPLANATION_PROMPT.format(
                    language=language,
                    plan=plan,
                    candidate_profile=json.dumps(profile, ensure_ascii=False),
                    jobs=json.dumps(compact_jobs, ensure_ascii=False),
                ),
            )
        ],
        options={"temperature": 0.7, "max_completion_tokens": 2200},
        format="json",
    )

    try:
        async with AIModelClient() as client:
            response = await client.chat(request)
        parsed = json.loads(response.content)
    except Exception as exc:
        logger.warning("Agent 2 match explanation failed: %s", exc)
        return jobs

    explanations = parsed.get("matches")
    if not isinstance(explanations, list):
        return jobs

    by_index = {
        item.get("index"): item
        for item in explanations
        if isinstance(item, dict) and isinstance(item.get("index"), int)
    }

    enriched_jobs = []
    for index, job in enumerate(jobs):
        enriched = dict(job)
        explanation = by_index.get(index)
        if explanation:
            enriched["match_explanation"] = {
                "why_it_fits": explanation.get("why_it_fits") or "",
                "strengths": _as_list(explanation.get("strengths")) or [],
                "missing": _as_list(explanation.get("missing")) or [],
                "final_tip": explanation.get("final_tip") or "",
            }
        enriched_jobs.append(enriched)
    return enriched_jobs


async def _analyze_with_llm(text: str) -> dict[str, Any]:
    # Agent 1 - Crida LLM: aquesta funció és el punt exacte on es consulta Groq
    # si AI_PROVIDER=groq està configurat a l'entorn.
    request = ChatRequest(
        messages=[
            ChatMessage(
                role="user",
                content=PROFILE_PROMPT.format(cv_text=text[:24000]),
            )
        ],
        options={"temperature": 0, "max_completion_tokens": 1800},
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
    # Agent 1 - Normalització: converteix el checklist inicial en un diccionari
    # fàcil de fusionar amb les respostes del LLM.
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
    # Agent 1 - Validació: acceptem només camps amb valor i confiança normalitzada.
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
    # Agent 1 - Fusió: combinem heurístiques + LLM mantenint el valor més fiable.
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
    # Sortida de l'Agent 1 per a l'Agent 2:
    # deixem un perfil petit i estable per buscar ofertes.
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
    # Agent 2 provisional: consulta i ordena ofertes des de la base de dades.
    # Més endavant es pot substituir per un JobMatchingAgent amb LLM explicable.
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
