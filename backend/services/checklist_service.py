"""Construeix l'estat del checklist laboral a partir de dades extretes del CV."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


CONFIG_PATH = Path(__file__).resolve().parent.parent / "config" / "cv_checklist.json"


def load_checklist_definition() -> dict[str, Any]:
    """Carrega la definició declarativa. No conté dades personals de l'usuari."""

    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


def build_checklist(
    extracted_profile: dict[str, Any],
    language: str = "ca",
) -> dict[str, Any]:
    """Combina la plantilla amb els valors detectats i calcula preguntes pendents."""

    definition = load_checklist_definition()
    language = language if language in {"ca", "es", "en"} else "ca"
    sections = []
    pending_free = []
    pending_pro = []

    for section in definition["sections"]:
        priority = section["priority"]
        plans = definition["priority_rules"][priority]
        fields = []

        for field in section["fields"]:
            key = f"{section['id']}.{field['id']}"
            detected = extracted_profile.get(key)
            value = detected.get("value") if detected else None
            confidence = detected.get("confidence", 0.0) if detected else 0.0

            if _has_value(value) and confidence >= 0.75:
                status = "completed"
            elif _has_value(value):
                status = "uncertain"
            else:
                status = "missing"

            item = {
                "key": key,
                "field": field["id"],
                "required": field.get("required", False),
                "priority": priority,
                "plans": plans,
                "status": status,
                "value": value,
                "confidence": round(confidence, 2),
                "source": detected.get("source", "user") if detected else None,
                "question": field["question"][language],
            }
            fields.append(item)

            if status != "completed" and field.get("required", False):
                if "free" in plans:
                    pending_free.append(item)
                if "pro" in plans:
                    pending_pro.append(item)

        sections.append(
            {
                "id": section["id"],
                "label": section["label"][language],
                "priority": priority,
                "plans": plans,
                "fields": fields,
                "completed": sum(item["status"] == "completed" for item in fields),
                "total": len(fields),
            }
        )

    return {
        "version": definition["version"],
        "sections": sections,
        "summary": {
            "completed": sum(section["completed"] for section in sections),
            "total": sum(section["total"] for section in sections),
            "free_pending_required": len(pending_free),
            "pro_pending_required": len(pending_pro),
        },
        "next_questions": {
            "free": pending_free,
            "pro": pending_pro,
        },
    }


def _has_value(value: Any) -> bool:
    if value is None:
        return False
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, (list, dict, tuple, set)):
        return bool(value)
    return True
