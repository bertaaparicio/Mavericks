# TalentMatchAI — Backend

AI-powered CV analysis and job matching system.

## Tech Stack

- **Python 3.12** + **FastAPI**
- **CrewAI** (CV Analyst + Job Matcher agents)
- **Ollama** (local LLM, default: `gpt-oss:20b`)
- **PostgreSQL** (job offers database)
- **PyPDF2** (PDF text extraction)

## Quick Start

### 1. Prerequisites

- PostgreSQL running locally with the `jobposts` table
- Ollama running locally with a model pulled
- Python 3.12+

### 2. Setup

```bash
# Copy env config
cp .env.template .env
# Edit .env if needed (DB credentials, model name)

# Initialize database (creates table + imports CSV)
python scripts/init_db.py

# Run server
uvicorn app.main:app --reload --port 8000
```

### 3. API Endpoints

#### `POST /match-cv` — Single-step CV analysis + matching

Upload a PDF CV, get AI analysis + ranked job matches.

```
curl -X POST http://localhost:8000/match-cv \
  -F "file=@/path/to/cv.pdf"
```

Response:
```json
{
  "cv_profile": "Structured profile text from AI...",
  "ranked_jobs": [
    {
      "job_title": "Senior Software Engineer",
      "company_name": "Acme Corp",
      "location": "Barcelona, Spain",
      "seniority_level": "Senior",
      "job_function": "Engineering",
      "employment_type": "Full-time",
      "industry": "Technology",
      "match_score": 45,
      "match_ratio": 90.0
    }
  ],
  "raw_output": "Raw text from job matcher agent..."
}
```

#### `POST /cv-qa/init` — Start interactive Q&A session

Upload a PDF CV and get the first clarifying question from the AI.

```
curl -X POST http://localhost:8000/cv-qa/init \
  -F "file=@/path/to/cv.pdf"
```

Response:
```json
{
  "session_id": "a1b2c3d4e5f6",
  "question": "What seniority level are you targeting?"
}
```

#### `POST /cv-qa/answer` — Answer a Q&A question

Send your answer to the AI's question. The AI will either ask another question or finalize the profile.

```
curl -X POST http://localhost:8000/cv-qa/answer \
  -H "Content-Type: application/json" \
  -d '{"session_id": "a1b2c3d4e5f6", "answer": "Senior level"}'
```

Response (still asking):
```json
{
  "session_id": "a1b2c3d4e5f6",
  "question": "Any preferred location?",
  "is_complete": false,
  "profile": null
}
```

Response (complete):
```json
{
  "session_id": "a1b2c3d4e5f6",
  "question": null,
  "is_complete": true,
  "profile": {
    "job_title_keywords": ["Software Engineer", "Python"],
    "seniority_level": "Senior",
    "location": "Barcelona",
    "job_function": "Engineering",
    "industry": "Technology",
    "employment_type": "Full-time"
  }
}
```

#### `GET /cv-qa/{session_id}` — Get Q&A session status

Check the current state of any session.

#### `POST /match-from-profile` — Match a structured profile

Once you have a finalized profile (from Q&A or otherwise), get ranked job matches.

```
curl -X POST http://localhost:8000/match-from-profile \
  -H "Content-Type: application/json" \
  -d '{
    "job_title_keywords": ["Software Engineer", "Python"],
    "seniority_level": "Senior",
    "location": "Barcelona",
    "job_function": "Engineering",
    "industry": "Technology",
    "employment_type": "Full-time"
  }'
```

Response:
```json
{
  "ranked_jobs": [
    {
      "job_title": "Senior Software Engineer",
      "company_name": "Acme Corp",
      "location": "Barcelona, Spain",
      "seniority_level": "Senior",
      "job_function": "Engineering",
      "employment_type": "Full-time",
      "industry": "Technology",
      "match_score": 45,
      "match_ratio": 90.0
    }
  ]
}
```

#### `GET /health` — Health check

### 4. Database

**Schema:**

```sql
CREATE TABLE jobposts (
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
```

**Import data:**

```bash
# Via psql
\copy jobposts(job_title, company_name, location, hiring_status, date, seniority_level, job_function, employment_type, industry) FROM 'data/linkedin_job_posts_insights.csv' DELIMITER ',' CSV HEADER;

# Or via init script
python scripts/init_db.py
```

### 5. Docker

```bash
docker-compose up --build
```

This starts PostgreSQL, Ollama, and the backend. The DB is initialized automatically.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OLLAMA_MODEL` | `gpt-oss:20b` | Ollama model name |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_NAME` | `postgres` | Database name |
| `DB_USER` | `postgres` | Database user |
| `DB_PASSWORD` | `12345` | Database password |
| `DB_PORT` | `5432` | Database port |
