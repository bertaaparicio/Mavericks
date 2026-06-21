from __future__ import annotations

import json
import logging
import re
from typing import Any

logger = logging.getLogger(__name__)


def parse_cv_profile(text: str) -> dict[str, Any]:
    fields = {
        "job_title_keywords": None,
        "seniority_level": None,
        "location": None,
        "job_function": None,
        "industry": None,
        "employment_type": None,
    }

    json_block = _extract_json_block(text)
    if json_block:
        try:
            data = json.loads(json_block)
            for key in fields:
                if key in data and data[key] is not None:
                    fields[key] = data[key]
            logger.info("Parsed CV profile from JSON block: %s", fields)
            return fields
        except json.JSONDecodeError:
            logger.debug("Found JSON block but failed to parse")

    yaml_block = _extract_yaml_block(text)
    if yaml_block:
        parsed = _parse_yaml_kv(yaml_block)
        for key in fields:
            if key in parsed:
                fields[key] = parsed[key]
        logger.info("Parsed CV profile from YAML block: %s", fields)
        return fields

    parsed = _parse_kv_text(text)
    for key in fields:
        if key in parsed:
            fields[key] = parsed[key]

    if any(v is not None for v in fields.values()):
        logger.info("Parsed CV profile from key-value text: %s", fields)
    else:
        logger.warning("Could not extract any CV profile fields from text")

    return fields


def _extract_json_block(text: str) -> str | None:
    match = re.search(r"```(?:json)?\s*\n?(.*?)\n?```", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    match = re.search(r"\{[^{}]*\"job_title_keywords\"[^{}]*\}", text, re.DOTALL)
    if match:
        return match.group(0)
    return None


def _extract_yaml_block(text: str) -> str | None:
    match = re.search(r"```(?:yaml)?\s*\n?(.*?)\n?```", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return None


def _parse_yaml_kv(text: str) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for line in text.split("\n"):
        line = line.strip()
        match = re.match(r"^[\s]*([\w_]+)[\s]*:[\s]*(.+)$", line)
        if match:
            key = match.group(1).strip()
            val = match.group(2).strip().strip("\"'")
            if val and val.lower() != "none" and val.lower() != "null":
                if key == "job_title_keywords" or key.endswith("skills"):
                    result[key] = [v.strip().strip("\"'") for v in val.split(",") if v.strip()]
                else:
                    result[key] = val
    return result


def _parse_kv_text(text: str) -> dict[str, Any]:
    result: dict[str, Any] = {}
    patterns = {
        "job_title_keywords": r"(?:job[_ ]title[_ ]keywords|keywords)[\s:]+(.+)",
        "seniority_level": r"(?:seniority[_ ]level|seniority)[\s:]+(.+)",
        "location": r"(?:preferred )?location[\s:]+(.+)",
        "job_function": r"(?:job[_ ]function|function)[\s:]+(.+)",
        "industry": r"industry[\s:]+(.+)",
        "employment_type": r"(?:employment[_ ]type|employment)[\s:]+(.+)",
    }
    for key, pattern in patterns.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            val = match.group(1).strip().strip("\"'")
            if val and val.lower() != "none" and val.lower() != "n/a":
                if key == "job_title_keywords":
                    result[key] = [v.strip() for v in val.split(",") if v.strip()]
                else:
                    result[key] = val
    return result
