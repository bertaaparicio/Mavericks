from __future__ import annotations

import logging
import os
import tempfile
from pathlib import Path
from typing import Any


def _load_env(path: Path | None = None) -> None:
    """Load a .env file into os.environ without external dependencies."""
    if path is None:
        path = Path(__file__).resolve().parents[2] / ".env"
    if not path.is_file():
        return
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip("\"'")
            os.environ.setdefault(key, value)


_load_env()

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from app.ai.config import OllamaSettings
from app.ai.ollama_client import AIModelClient
from app.ai.schemas import ChatMessage, ChatRequest
from app.services.database_service import query_jobs_structured
from app.services.integrated_cv_service import analyze_cv_and_match, match_after_answers
from app.services.pdf_service import extract_text_from_pdf
from app.services.profile_parser import parse_cv_profile
from app.services.qa_service import QAService

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

_qa_service: QAService | None = None


def get_qa_service() -> QAService:
    global _qa_service
    if _qa_service is None:
        _qa_service = QAService()
    return _qa_service


app = FastAPI(
    title="TalentMatchAI",
    description="AI-powered CV analysis and job matching system",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CV_ANALYSIS_PROMPT = """You are a Senior CV Analyst. Analyze the following CV text and extract a structured job search profile.

Return ONLY a JSON object with these fields:
- job_title_keywords: list of keywords for matching job titles (e.g. ["Machine Learning", "Engineer", "Data Scientist"])
- seniority_level: the candidate's seniority (e.g. "Senior", "Mid-Senior", "Entry")
- location: preferred work location(s)
- job_function: the job function area (e.g. "Engineering", "Sales", "Marketing")
- industry: the candidate's industry (e.g. "Technology", "Finance", "Healthcare")
- employment_type: type of employment (e.g. "Full-time", "Part-time", "Contract")
- skills: list of key technical and soft skills

Be thorough but only extract what is clearly present or strongly implied. Output ONLY valid JSON, no other text.

CV TEXT:
{cv_text}"""


class JobMatchExplanationResult(BaseModel):
    why_it_fits: str
    strengths: list[str]
    missing: list[str]
    final_tip: str


class JobMatchResult(BaseModel):
    job_title: str
    company_name: str
    location: str
    seniority_level: str
    job_function: str
    employment_type: str
    industry: str
    match_score: int
    match_ratio: float
    match_explanation: JobMatchExplanationResult | None = None


class MatchResponse(BaseModel):
    cv_profile: str
    ranked_jobs: list[JobMatchResult]


class QAInitResponse(BaseModel):
    session_id: str
    question: str


class QAAnswerRequest(BaseModel):
    session_id: str
    answer: str


class QAAnswerResponse(BaseModel):
    session_id: str
    question: str | None
    is_complete: bool
    profile: dict | None


class MatchFromProfileRequest(BaseModel):
    job_title_keywords: list[str] | None = None
    seniority_level: str | None = None
    location: str | None = None
    job_function: str | None = None
    industry: str | None = None
    employment_type: str | None = None
    language: str = "ca"
    plan: str = "free"


class MatchFromProfileResponse(BaseModel):
    ranked_jobs: list[JobMatchResult]


class CompleteProfileRequest(BaseModel):
    matching_profile: dict[str, Any]
    answers: dict[str, Any]
    language: str = "ca"
    plan: str = "free"


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/health/ai")
async def ai_health() -> dict[str, str | bool]:
    """Expose non-sensitive AI configuration for deployment verification."""

    provider = os.getenv("AI_PROVIDER", "groq").strip().lower()
    return {
        "status": "configured"
        if provider != "groq" or bool(os.getenv("GROQ_API_KEY"))
        else "missing_api_key",
        "provider": provider,
        "model": (
            os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
            if provider == "groq"
            else os.getenv("OLLAMA_MODEL", "llama2:latest")
        ),
        "fallback_provider": os.getenv("AI_FALLBACK_PROVIDER", "ollama"),
        "api_key_configured": bool(os.getenv("GROQ_API_KEY")),
    }


@app.post("/api/analyze")
async def integrated_analyze(
    cv: UploadFile = File(...),
    language: str = Form("ca"),
    plan: str = Form("free"),
) -> dict[str, Any]:
    """Frontend entrypoint: CV → Groq → checklist → PostgreSQL."""

    filename = cv.filename or "cv.pdf"
    content = await cv.read()
    if not content:
        raise HTTPException(status_code=400, detail="The uploaded CV is empty.")

    try:
        # Agent 1: aquest endpoint dispara el lector/anàlisi del CV.
        # Retorna resum, checklist, perfil de matching i ofertes inicials.
        return await analyze_cv_and_match(
            filename=filename,
            content=content,
            language=language,
            plan=plan,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Integrated CV analysis failed")
        raise HTTPException(
            status_code=502,
            detail=f"The CV could not be analyzed: {exc}",
        ) from exc


@app.post("/api/profile/complete")
async def complete_profile(body: CompleteProfileRequest) -> dict[str, Any]:
    """Rerun job matching after the candidate answers pending questions."""

    # Agent 1 bis + Agent 2 provisional:
    # l'usuari completa preguntes pendents i tornem a consultar ofertes.
    return {
        "ranked_jobs": await match_after_answers(
            matching_profile=body.matching_profile,
            answers=body.answers,
            language=body.language,
            plan=body.plan,
        )
    }


@app.post("/match-cv", response_model=MatchResponse)
async def match_cv(file: UploadFile = File(...)) -> MatchResponse:
    suffix = os.path.splitext(file.filename or "cv.pdf")[1]
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    try:
        content = await file.read()
        tmp.write(content)
        tmp.flush()
        tmp.close()

        logger.info("Processing CV upload: %s (%d bytes)", file.filename, len(content))
        cv_text = extract_text_from_pdf(tmp.name)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read PDF: {e}")
    finally:
        os.unlink(tmp.name)

    if not cv_text.strip():
        raise HTTPException(
            status_code=400, detail="PDF is empty or could not be parsed"
        )

    logger.info("Extracted %d characters from CV", len(cv_text))

    settings = OllamaSettings.from_env()
    async with AIModelClient(settings=settings) as client:
        response = await client.chat(
            ChatRequest(
                messages=[
                    ChatMessage(
                        role="user", content=CV_ANALYSIS_PROMPT.format(cv_text=cv_text)
                    )
                ],
            )
        )

    cv_profile = response.content
    logger.info("CV analysis complete (%d chars)", len(cv_profile))

    profile = parse_cv_profile(cv_profile)
    logger.info("Extracted profile params: %s", profile)

    jobs = await _search_jobs(profile)
    return MatchResponse(cv_profile=cv_profile, ranked_jobs=jobs)


@app.post("/cv-qa/init", response_model=QAInitResponse)
async def cv_qa_init(
    file: UploadFile = File(...),
    language: str = Form("ca"),
) -> QAInitResponse:
    filename = file.filename or "cv.pdf"
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="The uploaded CV is empty.")

    try:
        from app.services.cv_reader import extract_text
        cv_text, _ = extract_text(filename, content, language)
    except ValueError as val_err:
        raise HTTPException(status_code=400, detail=str(val_err)) from val_err
    except Exception as e:
        logger.exception("In-memory extraction failed")
        raise HTTPException(status_code=400, detail=f"Failed to read PDF/DOCX: {e}")

    if not cv_text.strip():
        raise HTTPException(
            status_code=400, detail="CV is empty or could not be parsed"
        )

    session = await get_qa_service().init_session(cv_text, language)
    return QAInitResponse(
        session_id=session.session_id,
        question=session.current_question or "Profile complete.",
    )


@app.post("/cv-qa/answer", response_model=QAAnswerResponse)
async def cv_qa_answer(body: QAAnswerRequest) -> QAAnswerResponse:
    try:
        session = await get_qa_service().process_answer(body.session_id, body.answer)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    return QAAnswerResponse(
        session_id=session.session_id,
        question=session.current_question,
        is_complete=session.is_complete,
        profile=session.profile,
    )


@app.get("/cv-qa/{session_id}", response_model=QAAnswerResponse)
async def cv_qa_status(session_id: str) -> QAAnswerResponse:
    session = get_qa_service().get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail=f"Session {session_id} not found")

    return QAAnswerResponse(
        session_id=session.session_id,
        question=session.current_question,
        is_complete=session.is_complete,
        profile=session.profile,
    )


@app.post("/match-from-profile", response_model=MatchFromProfileResponse)
async def match_from_profile(body: MatchFromProfileRequest) -> MatchFromProfileResponse:
    profile = body.model_dump()
    raw_jobs = await _search_jobs(profile)

    from app.services.integrated_cv_service import _explain_job_matches
    jobs_dicts = [
        {
            "job_title": j.job_title,
            "company_name": j.company_name,
            "location": j.location,
            "seniority_level": j.seniority_level,
            "job_function": j.job_function,
            "employment_type": j.employment_type,
            "industry": j.industry,
            "match_score": j.match_score,
            "match_ratio": j.match_ratio,
        }
        for j in raw_jobs
    ]

    explained_dicts = await _explain_job_matches(
        profile=profile,
        jobs=jobs_dicts,
        language=body.language,
        plan=body.plan,
    )

    ranked_jobs = []
    for j in explained_dicts:
        exp = j.get("match_explanation")
        match_exp = None
        if exp:
            match_exp = JobMatchExplanationResult(
                why_it_fits=exp.get("why_it_fits", ""),
                strengths=exp.get("strengths") or [],
                missing=exp.get("missing") or [],
                final_tip=exp.get("final_tip", ""),
            )
        ranked_jobs.append(
            JobMatchResult(
                job_title=j.get("job_title", ""),
                company_name=j.get("company_name", ""),
                location=j.get("location", ""),
                seniority_level=j.get("seniority_level", ""),
                job_function=j.get("job_function", ""),
                employment_type=j.get("employment_type", ""),
                industry=j.get("industry", ""),
                match_score=j.get("match_score", 0),
                match_ratio=j.get("match_ratio", 0.0),
                match_explanation=match_exp,
            )
        )
    return MatchFromProfileResponse(ranked_jobs=ranked_jobs)


async def _search_jobs(profile: dict) -> list[JobMatchResult]:
    keywords = profile.get("job_title_keywords")
    if isinstance(keywords, list):
        pass
    elif isinstance(keywords, str):
        keywords = [k.strip() for k in keywords.split(",") if k.strip()]
    else:
        keywords = None

    jobs: list[JobMatchResult] = []
    try:
        raw_jobs = query_jobs_structured(
            job_title_keywords=keywords,
            seniority_level=profile.get("seniority_level"),
            location=profile.get("location"),
            job_function=profile.get("job_function"),
            industry=profile.get("industry"),
            employment_type=profile.get("employment_type"),
        )
        for j in raw_jobs:
            jobs.append(
                JobMatchResult(
                    job_title=j.get("job_title", ""),
                    company_name=j.get("company_name", ""),
                    location=j.get("location", ""),
                    seniority_level=j.get("seniority_level", ""),
                    job_function=j.get("job_function", ""),
                    employment_type=j.get("employment_type", ""),
                    industry=j.get("industry", ""),
                    match_score=j.get("match_score", 0),
                    match_ratio=j.get("match_ratio", 0.0),
                )
            )
    except Exception as e:
        logger.warning("Database query failed: %s", e)

    return jobs


def _frontend_root() -> Path | None:
    candidates = [
        Path(__file__).resolve().parents[3] / "frontend" / "dist",
        Path("/app/frontend/dist"),
    ]
    return next((candidate for candidate in candidates if candidate.is_dir()), None)


@app.get("/{full_path:path}", include_in_schema=False)
async def serve_frontend(full_path: str) -> FileResponse:
    """Serve the React build while preserving all existing API endpoints."""

    frontend_root = _frontend_root()
    if frontend_root is None:
        raise HTTPException(
            status_code=503,
            detail="Frontend not built. Run npm.cmd run build inside frontend.",
        )

    requested = (frontend_root / full_path).resolve()
    if frontend_root.resolve() in requested.parents and requested.is_file():
        return FileResponse(requested)
    return FileResponse(frontend_root / "index.html")
