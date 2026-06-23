"""Standalone test script: PDF CV → AI analysis → DB match → ranked results.

Usage:
    python scripts/test_cv.py /path/to/cv.pdf
    python scripts/test_cv.py /path/to/cv.pdf --model llama2:latest
"""

# ruff: noqa: E402

from __future__ import annotations

import argparse
import asyncio
import logging
import sys
from pathlib import Path

# Ensure app package is importable when run from backend/
_backend_dir = Path(__file__).resolve().parent.parent
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

from app.ai.config import OllamaSettings
from app.ai.ollama_client import AIModelClient
from app.ai.schemas import ChatMessage, ChatRequest
from app.services.database_service import query_jobs_structured
from app.services.pdf_service import extract_text_from_pdf
from app.services.profile_parser import parse_cv_profile

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("test_cv")

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


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Analyze a CV and match against job offers.")
    parser.add_argument("pdf_path", type=str, help="Path to the CV PDF file")
    parser.add_argument("--model", type=str, default=None, help="Ollama model name (default: from .env or gpt-oss:20b)")
    return parser.parse_args()


async def analyze_cv(cv_text: str, model: str | None = None) -> str:
    settings = OllamaSettings.from_env()
    if model:
        settings = OllamaSettings(model=model, host=settings.host, timeout=settings.timeout, keep_alive=settings.keep_alive)
    logger.info("Sending CV to Ollama (model=%s, %d chars)...", settings.model, len(cv_text))
    async with AIModelClient(settings=settings) as client:
        response = await client.chat(ChatRequest(
            messages=[ChatMessage(role="user", content=CV_ANALYSIS_PROMPT.format(cv_text=cv_text))],
        ))
    return response.content


def main() -> None:
    args = parse_args()

    pdf_path = Path(args.pdf_path)
    if not pdf_path.exists():
        print(f"Error: file not found: {pdf_path}", file=sys.stderr)
        sys.exit(1)

    print(f"\n{'='*60}")
    print(f"  CV: {pdf_path.name}")
    print(f"{'='*60}\n")

    # Step 1: Extract text
    print("1. Extracting text from PDF...")
    cv_text = extract_text_from_pdf(str(pdf_path))
    
    if not cv_text.strip():
        print("   ERROR: PDF is empty or could not be parsed", file=sys.stderr)
        sys.exit(1)
    print(f"   Extracted {len(cv_text)} characters\n")

    # Step 2: AI analysis
    print("2. Analyzing CV with AI...")
    # raw_output = asyncio.run(analyze_cv(cv_text, model=args.model))
    raw_output = asyncio.run(analyze_cv(cv_text, model="llama2:latest"))
    print(f"   AI response: {len(raw_output)} chars\n")

    # Step 3: Parse profile
    print("3. Parsing profile...")
    profile = parse_cv_profile(raw_output)
    print(f"   job_title_keywords: {profile.get('job_title_keywords')}")
    print(f"   seniority_level:    {profile.get('seniority_level')}")
    print(f"   location:           {profile.get('location')}")
    print(f"   job_function:       {profile.get('job_function')}")
    print(f"   industry:           {profile.get('industry')}")
    print(f"   employment_type:    {profile.get('employment_type')}")
    print()

    # Step 4: Search database
    print("4. Searching job database...")
    try:
        results = query_jobs_structured(
            job_title_keywords=profile.get("job_title_keywords"),
            seniority_level=profile.get("seniority_level"),
            location=profile.get("location"),
            job_function=profile.get("job_function"),
            industry=profile.get("industry"),
            employment_type=profile.get("employment_type"),
        )
    except Exception as e:
        print(f"   ERROR: Database query failed: {e}", file=sys.stderr)
        sys.exit(1)

    if not results:
        print("   No matching jobs found.\n")
        return

    print(f"   Found {len(results)} matching jobs\n")

    # Step 5: Display results
    print(f"{'='*60}")
    print(f"  TOP {len(results)} MATCHING JOBS")
    print(f"{'='*60}\n")

    for i, job in enumerate(results, 1):
        print(f"  {i}. {job['job_title']}")
        print(f"     Company:  {job['company_name']}")
        print(f"     Location: {job['location']}")
        print(f"     Score:    {job['match_score']} pts  ({job['match_ratio']}% match)")
        print(f"     Seniority: {job['seniority_level']}  |  Function: {job['job_function']}")
        print(f"     Type:     {job['employment_type']}  |  Industry: {job['industry']}")
        print()


if __name__ == "__main__":
    main()
