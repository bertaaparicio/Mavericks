from __future__ import annotations

import logging
import os
from typing import Any

import psycopg2
from psycopg2.extras import RealDictCursor

logger = logging.getLogger(__name__)

DB_CONFIG = {
    "host": os.getenv("DB_HOST", ""),
    "database": os.getenv("DB_NAME", "postgres"),
    "user": os.getenv("DB_USER", "grau"),
    "password": os.getenv("DB_PASSWORD", ""),
    "port": os.getenv("DB_PORT", "5432"),
}

SCORE_FIELD_MATCH = 10
SCORE_KEYWORD_MATCH = 5
RESULT_LIMIT = 10


class DatabaseConnection:
    def __init__(self) -> None:
        self._conn = psycopg2.connect(**DB_CONFIG)

    def __enter__(self) -> DatabaseConnection:
        return self

    def __exit__(self, *_: object) -> None:
        self.close()

    def close(self) -> None:
        if self._conn and not self._conn.closed:
            self._conn.close()

    def search_jobs(
        self,
        job_title_keywords: list[str] | None = None,
        seniority_level: str | None = None,
        location: str | None = None,
        job_function: str | None = None,
        industry: str | None = None,
        employment_type: str | None = None,
        limit: int = RESULT_LIMIT,
    ) -> list[dict[str, Any]]:
        raw = self._fetch_candidates(
            job_title_keywords=job_title_keywords,
            seniority_level=seniority_level,
            location=location,
            job_function=job_function,
            industry=industry,
            employment_type=employment_type,
            limit=limit,
        )
        ranked = self._rank_results(
            raw,
            job_title_keywords=job_title_keywords,
            seniority_level=seniority_level,
            location=location,
            job_function=job_function,
            industry=industry,
            employment_type=employment_type,
        )
        return ranked[:limit]

    def _fetch_candidates(
        self,
        job_title_keywords: list[str] | None = None,
        seniority_level: str | None = None,
        location: str | None = None,
        job_function: str | None = None,
        industry: str | None = None,
        employment_type: str | None = None,
        limit: int = 30,
    ) -> list[dict[str, Any]]:
        values: list[Any] = []

        where_clauses: list[str] = []
        if job_title_keywords:
            or_conds = []
            for kw in job_title_keywords:
                or_conds.append("job_title ILIKE %s")
                values.append(f"%{kw}%")
            where_clauses.append("(" + " OR ".join(or_conds) + ")")

        if not where_clauses:
            return []

        where = " AND ".join(where_clauses)

        query = f"""
            SELECT job_title, company_name, location, seniority_level,
                   job_function, employment_type, industry
            FROM jobposts
            WHERE {where}
            LIMIT %s
        """
        values.append(limit * 3)

        logger.debug("Executing query: %s with params: %s", query, values)
        with self._conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query, values)
            rows = [dict(row) for row in cur.fetchall()]
            logger.info("Fetched %d candidate rows from database", len(rows))
            return rows

    def _count_fields_provided(
        self,
        seniority_level: str | None = None,
        location: str | None = None,
        job_function: str | None = None,
        industry: str | None = None,
        employment_type: str | None = None,
    ) -> int:
        count = 0
        if seniority_level:
            count += 1
        if location:
            count += 1
        if job_function:
            count += 1
        if industry:
            count += 1
        if employment_type:
            count += 1
        return count

    def _rank_results(
        self,
        rows: list[dict[str, Any]],
        job_title_keywords: list[str] | None = None,
        seniority_level: str | None = None,
        location: str | None = None,
        job_function: str | None = None,
        industry: str | None = None,
        employment_type: str | None = None,
    ) -> list[dict[str, Any]]:
        fields_provided = self._count_fields_provided(
            seniority_level=seniority_level,
            location=location,
            job_function=job_function,
            industry=industry,
            employment_type=employment_type,
        )
        keywords_count = len(job_title_keywords) if job_title_keywords else 0
        max_possible = (fields_provided * SCORE_FIELD_MATCH) + (keywords_count * SCORE_KEYWORD_MATCH)

        def _score(row: dict[str, Any]) -> int:
            score = 0

            if job_title_keywords:
                title_lower = (row.get("job_title") or "").lower()
                for kw in job_title_keywords:
                    if kw.lower() in title_lower:
                        score += SCORE_KEYWORD_MATCH

            if seniority_level:
                sl = (row.get("seniority_level") or "").lower()
                if seniority_level.lower() in sl:
                    score += SCORE_FIELD_MATCH

            if location:
                loc = (row.get("location") or "").lower()
                for part in location.split(","):
                    if part.strip().lower() in loc:
                        score += SCORE_FIELD_MATCH
                        break

            if job_function:
                jf = (row.get("job_function") or "").lower()
                if job_function.lower() in jf:
                    score += SCORE_FIELD_MATCH

            if industry:
                ind = (row.get("industry") or "").lower()
                if industry.lower() in ind:
                    score += SCORE_FIELD_MATCH

            if employment_type:
                et = (row.get("employment_type") or "").lower()
                if employment_type.lower() in et:
                    score += SCORE_FIELD_MATCH

            return score

        for row in rows:
            score = _score(row)
            row["match_score"] = score
            if max_possible > 0:
                row["match_ratio"] = round(min(100.0, (score / max_possible) * 100), 1)
            else:
                row["match_ratio"] = 0.0

        rows.sort(key=lambda r: r["match_score"], reverse=True)
        return rows


def query_jobs(
    job_title_keywords: list[str] | None = None,
    seniority_level: str | None = None,
    location: str | None = None,
    job_function: str | None = None,
    industry: str | None = None,
    employment_type: str | None = None,
    limit: int = RESULT_LIMIT,
) -> str:
    db = DatabaseConnection()
    try:
        results = db.search_jobs(
            job_title_keywords=job_title_keywords,
            seniority_level=seniority_level,
            location=location,
            job_function=job_function,
            industry=industry,
            employment_type=employment_type,
            limit=limit,
        )
    finally:
        db.close()

    if not results:
        return "No matching jobs found."

    lines = ["Ranked Job Matches (highest score first):", ""]
    for i, row in enumerate(results, 1):
        lines.append(
            f"{i}. {row['job_title']}"
        )
        lines.append(f"   Company: {row['company_name']}  |  Match Score: {row['match_score']} ({row['match_ratio']}%)")
        lines.append(f"   Location: {row['location']}")
        lines.append(f"   Seniority: {row['seniority_level']}  |  Function: {row['job_function']}")
        lines.append(f"   Employment: {row['employment_type']}  |  Industry: {row['industry']}")
        lines.append("")

    return "\n".join(lines)


def query_jobs_structured(
    job_title_keywords: list[str] | None = None,
    seniority_level: str | None = None,
    location: str | None = None,
    job_function: str | None = None,
    industry: str | None = None,
    employment_type: str | None = None,
    limit: int = RESULT_LIMIT,
) -> list[dict[str, Any]]:
    db = DatabaseConnection()
    try:
        results = db.search_jobs(
            job_title_keywords=job_title_keywords,
            seniority_level=seniority_level,
            location=location,
            job_function=job_function,
            industry=industry,
            employment_type=employment_type,
            limit=limit,
        )
    finally:
        db.close()

    return results
