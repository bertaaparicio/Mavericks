"""Initialize the PostgreSQL database with the jobposts table and import CSV data."""

from __future__ import annotations

import csv
import io
import logging
import os
import zipfile

import psycopg2

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DB_CONFIG = {
    "host": os.getenv("DB_HOST", ""),
    "database": os.getenv("DB_NAME", "postgres"),
    "user": os.getenv("DB_USER", "grau"),
    "password": os.getenv("DB_PASSWORD", ""),
    "port": os.getenv("DB_PORT", "5432"),
}

CSV_ZIP = os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "data", "linkedin_job_posts_insights.zip"
)

CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS jobposts (
    job_title TEXT,
    company_name TEXT,
    location TEXT,
    hiring_status TEXT,
    date TEXT,
    seniority_level TEXT,
    job_function TEXT,
    employment_type TEXT,
    industry TEXT
);
"""

COUNT_SQL = "SELECT COUNT(*) FROM jobposts;"

COPY_SQL = """
INSERT INTO jobposts (job_title, company_name, location, hiring_status, date, seniority_level, job_function, employment_type, industry)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
"""


def main() -> None:
    logger.info("Connecting to database at %s:%s/%s", DB_CONFIG["host"], DB_CONFIG["port"], DB_CONFIG["database"])
    conn = psycopg2.connect(**DB_CONFIG)
    conn.autocommit = False
    try:
        with conn.cursor() as cur:
            logger.info("Creating table if not exists...")
            cur.execute(CREATE_TABLE_SQL)
            cur.execute(COUNT_SQL)
            existing_rows = cur.fetchone()[0]
            if existing_rows:
                conn.commit()
                logger.info(
                    "Database already contains %d job posts; skipping import.",
                    existing_rows,
                )
                return

        csv_path = os.path.abspath(CSV_ZIP)
        logger.info("Reading CSV from: %s", csv_path)

        if not os.path.exists(csv_path):
            logger.error("CSV zip not found at %s", csv_path)
            conn.rollback()
            return

        with zipfile.ZipFile(csv_path) as z:
            csv_files = [f for f in z.namelist() if f.endswith(".csv")]
            if not csv_files:
                logger.error("No CSV file found in zip archive")
                return

            with z.open(csv_files[0]) as f:
                reader = csv.reader(io.TextIOWrapper(f, encoding="utf-8"))
                header = next(reader)
                logger.info("CSV columns: %s", header)

                with conn.cursor() as cur:
                    count = 0
                    for row in reader:
                        cleaned = [cell.strip().replace("\n", " ").replace("\r", " ") for cell in row[:9]]
                        cur.execute(COPY_SQL, cleaned)
                        count += 1
                        if count % 1000 == 0:
                            logger.info("Inserted %d rows...", count)

                    conn.commit()
                    logger.info("Successfully inserted %d rows into jobposts", count)
    except Exception as e:
        conn.rollback()
        logger.error("Error initializing database: %s", e)
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    main()
