from __future__ import annotations

import json
import logging
import uuid
from typing import Any

from app.ai.config import OllamaSettings
from app.ai.ollama_client import OllamaModelClient
from app.ai.schemas import ChatMessage, ChatRequest

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a Senior CV Analyst & Job Profile Specialist. Your task is to analyze a candidate's CV and build a complete structured profile for job matching.

You have these fields to fill:
- job_title_keywords: keywords for matching job titles (list of strings)
- seniority_level: e.g. "Senior", "Mid-Senior", "Entry", "Director"
- location: preferred work location(s)
- job_function: e.g. "Engineering", "Sales", "Marketing", "Finance"
- industry: e.g. "Technology", "Finance", "Healthcare"
- employment_type: e.g. "Full-time", "Part-time", "Contract"

First read the CV text provided. Some fields may be clear from the CV, others may be ambiguous or missing.

Your job is to ask the candidate ONE question at a time to clarify the missing or ambiguous fields. Be conversational and natural.

After each answer, decide if you have enough information to build the full profile, or if you need to ask another question.

When you have enough information, output ONLY a JSON object with the complete profile. Do NOT include any other text.

Rules:
- Ask ONE question per turn
- Keep questions concise and friendly
- If a field is clearly stated in the CV, do NOT ask about it — just use the CV value
- Prioritize asking about ambiguous or missing fields
- Ask about a maximum of 5 questions total
- When done, output ONLY valid JSON

Output format when asking a question:
{"type": "question", "question": "your question here"}

Output format when profile is complete:
{"type": "profile", "profile": {"job_title_keywords": [...], "seniority_level": "...", "location": "...", "job_function": "...", "industry": "...", "employment_type": "..."}}
"""


class QASession:
    def __init__(self, cv_text: str) -> None:
        self.session_id = uuid.uuid4().hex[:12]
        self.cv_text = cv_text
        self.messages: list[ChatMessage] = [
            ChatMessage(role="user", content=f"Here is the CV text to analyze:\n\n{cv_text}"),
        ]
        self.profile: dict[str, Any] | None = None
        self.is_complete = False
        self.current_question: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return {
            "session_id": self.session_id,
            "is_complete": self.is_complete,
            "current_question": self.current_question,
            "profile": self.profile,
        }


class QAService:
    def __init__(self) -> None:
        self.sessions: dict[str, QASession] = {}
        settings = OllamaSettings.from_env()
        self.client = OllamaModelClient(settings=settings)

    async def init_session(self, cv_text: str) -> QASession:
        session = QASession(cv_text)
        self.sessions[session.session_id] = session

        response = await self.client.chat(ChatRequest(
            messages=session.messages,
            system=SYSTEM_PROMPT,
        ))

        parsed = self._parse_response(response.content)
        if parsed["type"] == "question":
            session.current_question = parsed["question"]
            session.messages.append(ChatMessage(role="assistant", content=response.content))
        elif parsed["type"] == "profile":
            session.profile = parsed["profile"]
            session.is_complete = True

        logger.info("Q&A session %s initialized, question: %s", session.session_id, session.current_question)
        return session

    async def process_answer(self, session_id: str, answer: str) -> QASession:
        session = self.sessions.get(session_id)
        if not session:
            raise ValueError(f"Session {session_id} not found")

        if session.is_complete:
            return session

        session.messages.append(ChatMessage(role="user", content=answer))

        response = await self.client.chat(ChatRequest(
            messages=session.messages,
            system=SYSTEM_PROMPT,
        ))

        parsed = self._parse_response(response.content)
        if parsed["type"] == "question":
            session.current_question = parsed["question"]
            session.messages.append(ChatMessage(role="assistant", content=response.content))
        elif parsed["type"] == "profile":
            session.profile = parsed["profile"]
            session.is_complete = True
            session.current_question = None

        logger.info(
            "Q&A session %s: complete=%s, question=%s",
            session_id, session.is_complete, session.current_question,
        )
        return session

    def get_session(self, session_id: str) -> QASession | None:
        return self.sessions.get(session_id)

    def _parse_response(self, content: str) -> dict[str, Any]:
        content = content.strip()
        json_block = content
        if "```" in content:
            import re
            match = re.search(r"```(?:json)?\s*\n?(.*?)\n?```", content, re.DOTALL)
            if match:
                json_block = match.group(1).strip()
        try:
            return json.loads(json_block)
        except json.JSONDecodeError:
            logger.warning("Failed to parse LLM response as JSON, treating as question: %s", content[:200])
            return {"type": "question", "question": content}
