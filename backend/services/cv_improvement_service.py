"""Auditoria inicial de millora del CV per al pla PRO.

Les regles actuals són deterministes i explicables. Quan s'integri el LLM,
aquest servei continuarà retornant el mateix contracte JSON, però podrà generar
reescriptures més precises a partir dels fragments detectats.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any


CONFIG_PATH = Path(__file__).resolve().parent.parent / "config" / "cv_improvement_checklist.json"

GENERIC_PITCH_MARKERS = (
    "dinàmic", "dinámico", "dynamic", "treballador", "trabajador", "hard-working",
    "ganes d'aprendre", "ganas de aprender", "eager to learn", "apassionat",
    "apasionado", "passionate", "responsable", "proactiu", "proactivo", "proactive",
)

WEAK_VERB_MARKERS = (
    "vaig ajudar", "ayudé", "helped", "participació en", "participación en",
    "participated in", "responsable de", "responsible for", "encarregat de",
    "encargado de", "tasques de", "tareas de", "duties included",
)

PROFILE_MARKERS = (
    "perfil", "sobre mi", "about me", "professional summary", "resum professional",
    "resumen profesional", "objectiu professional", "objetivo profesional",
)

SKILLS_SECTION_MARKERS = (
    "habilitats", "competències", "habilidades", "competencias", "skills",
    "stack tècnic", "stack técnico", "technical stack", "tecnologies", "tecnologías",
)


TEXTS = {
    "ca": {
        "good": "Correcte",
        "improve": "Es pot millorar",
        "market": "Requereix dades d'ofertes",
        "quant_good": "El CV inclou resultats amb dades o mètriques concretes.",
        "quant_bad": "Les tasques es descriuen, però gairebé no hi ha resultats quantificats.",
        "quant_rec": "Afegeix xifres: percentatges, temps estalviat, volum gestionat, ingressos o persones impactades.",
        "market_finding": "Encara no podem calcular els skill gaps sense comparar el perfil amb ofertes reals del rol objectiu.",
        "market_rec": "Quan connectem les ofertes, compararem les teves competències amb els Must Have i Nice to Have més freqüents.",
        "ats_good": "El CV conté seccions clares de competències que faciliten la lectura ATS.",
        "ats_bad": "No s'ha identificat una secció clara d'habilitats o stack tècnic.",
        "ats_rec": "Crea una secció específica de competències amb eines i tecnologies en vinyetes simples.",
        "pitch_good": "S'ha detectat un resum professional específic i llegible.",
        "pitch_missing": "No s'ha detectat un resum professional o elevator pitch clar.",
        "pitch_generic": "El resum professional utilitza expressions genèriques que no diferencien el perfil.",
        "pitch_rec": "Resumeix en 2-3 línies el teu rol, anys d'experiència, especialització i impacte principal.",
        "verbs_good": "No s'han detectat usos destacats de verbs febles.",
        "verbs_bad": "S'han detectat expressions passives o poc orientades a l'acció.",
        "verbs_rec": "Comença les fites amb verbs forts com: vaig implementar, vaig liderar, vaig optimitzar, vaig crear o vaig augmentar.",
    },
    "es": {
        "good": "Correcto",
        "improve": "Se puede mejorar",
        "market": "Requiere datos de ofertas",
        "quant_good": "El CV incluye resultados con datos o métricas concretas.",
        "quant_bad": "Las tareas se describen, pero apenas aparecen resultados cuantificados.",
        "quant_rec": "Añade cifras: porcentajes, tiempo ahorrado, volumen gestionado, ingresos o personas impactadas.",
        "market_finding": "Todavía no podemos calcular los skill gaps sin comparar el perfil con ofertas reales del puesto objetivo.",
        "market_rec": "Cuando conectemos las ofertas, compararemos tus competencias con los Must Have y Nice to Have más frecuentes.",
        "ats_good": "El CV contiene secciones claras de competencias que facilitan la lectura ATS.",
        "ats_bad": "No se ha identificado una sección clara de habilidades o stack técnico.",
        "ats_rec": "Crea una sección específica de competencias con herramientas y tecnologías en viñetas simples.",
        "pitch_good": "Se ha detectado un resumen profesional específico y legible.",
        "pitch_missing": "No se ha detectado un resumen profesional o elevator pitch claro.",
        "pitch_generic": "El resumen profesional utiliza expresiones genéricas que no diferencian el perfil.",
        "pitch_rec": "Resume en 2-3 líneas tu rol, años de experiencia, especialización e impacto principal.",
        "verbs_good": "No se han detectado usos destacados de verbos débiles.",
        "verbs_bad": "Se han detectado expresiones pasivas o poco orientadas a la acción.",
        "verbs_rec": "Empieza los logros con verbos fuertes como: implementé, lideré, optimicé, creé o aumenté.",
    },
    "en": {
        "good": "Good",
        "improve": "Can be improved",
        "market": "Requires job data",
        "quant_good": "The résumé includes results supported by concrete data or metrics.",
        "quant_bad": "Tasks are described, but there are very few quantified outcomes.",
        "quant_rec": "Add figures such as percentages, time saved, volume handled, revenue or people impacted.",
        "market_finding": "Skill gaps cannot yet be calculated without comparing the profile with real jobs for the target role.",
        "market_rec": "Once jobs are connected, we will compare your skills with the most frequent Must Have and Nice to Have requirements.",
        "ats_good": "The résumé contains clear skill sections that support ATS parsing.",
        "ats_bad": "No clear skills or technical stack section was identified.",
        "ats_rec": "Create a dedicated skills section listing tools and technologies with simple bullet points.",
        "pitch_good": "A specific and readable professional summary was detected.",
        "pitch_missing": "No clear professional summary or elevator pitch was detected.",
        "pitch_generic": "The professional summary uses generic language that does not differentiate the profile.",
        "pitch_rec": "Summarize your role, experience, specialization and main impact in 2-3 lines.",
        "verbs_good": "No significant weak action phrases were detected.",
        "verbs_bad": "Passive or weak action phrases were detected.",
        "verbs_rec": "Start achievements with strong verbs such as implemented, led, optimized, created or increased.",
    },
}


def evaluate_cv_improvements(
    *,
    text: str,
    lines: list[str],
    sections: list[str],
    language: str = "ca",
) -> dict[str, Any]:
    """Avalua els cinc criteris del checklist PRO i retorna recomanacions."""

    definition = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    language = language if language in TEXTS else "ca"
    labels = TEXTS[language]
    checks = []

    quantified_lines = [
        line for line in lines
        if re.search(r"\b\d+(?:[.,]\d+)?\s*(?:%|€|\$|hores?|horas?|hours?|clients?|clientes?|users?)\b", line, re.I)
    ]
    checks.append(
        _result(
            definition, "quantified_results", language,
            "good" if quantified_lines else "improve",
            labels["quant_good"] if quantified_lines else labels["quant_bad"],
            None if quantified_lines else labels["quant_rec"],
            quantified_lines[:3],
        )
    )

    checks.append(
        _result(
            definition, "skill_gaps", language, "needs_market_data",
            labels["market_finding"], labels["market_rec"], [],
        )
    )

    has_skills_section = any(
        marker in text.casefold() for marker in SKILLS_SECTION_MARKERS
    ) or any(section in {"habilitats", "skills"} for section in sections)
    checks.append(
        _result(
            definition, "ats_optimization", language,
            "good" if has_skills_section else "improve",
            labels["ats_good"] if has_skills_section else labels["ats_bad"],
            None if has_skills_section else labels["ats_rec"],
            [],
        )
    )

    pitch_lines = [
        line for index, line in enumerate(lines)
        if any(marker in line.casefold() for marker in PROFILE_MARKERS)
        for line in lines[index + 1:index + 4]
        if 25 <= len(line) <= 350
    ][:3]
    generic_pitch = any(
        marker in " ".join(pitch_lines).casefold() for marker in GENERIC_PITCH_MARKERS
    )
    if not pitch_lines:
        pitch_status, pitch_finding = "improve", labels["pitch_missing"]
    elif generic_pitch:
        pitch_status, pitch_finding = "improve", labels["pitch_generic"]
    else:
        pitch_status, pitch_finding = "good", labels["pitch_good"]
    checks.append(
        _result(
            definition, "elevator_pitch", language, pitch_status, pitch_finding,
            labels["pitch_rec"] if pitch_status == "improve" else None, pitch_lines,
        )
    )

    weak_lines = [
        line for line in lines
        if any(marker in line.casefold() for marker in WEAK_VERB_MARKERS)
    ]
    checks.append(
        _result(
            definition, "action_verbs", language,
            "improve" if weak_lines else "good",
            labels["verbs_bad"] if weak_lines else labels["verbs_good"],
            labels["verbs_rec"] if weak_lines else None,
            weak_lines[:4],
        )
    )

    evaluable = [check for check in checks if check["status"] != "needs_market_data"]
    passed_weight = sum(check["weight"] for check in evaluable if check["status"] == "good")
    available_weight = sum(check["weight"] for check in evaluable)
    score = round((passed_weight / available_weight) * 100) if available_weight else 0

    return {
        "version": definition["version"],
        "plan": "pro",
        "score": score,
        "checks": checks,
        "summary": {
            "good": sum(check["status"] == "good" for check in checks),
            "improve": sum(check["status"] == "improve" for check in checks),
            "needs_market_data": sum(check["status"] == "needs_market_data" for check in checks),
        },
    }


def _result(
    definition: dict,
    check_id: str,
    language: str,
    status: str,
    finding: str,
    recommendation: str | None,
    evidence: list[str],
) -> dict:
    check = next(item for item in definition["checks"] if item["id"] == check_id)
    return {
        "id": check_id,
        "label": check["label"][language],
        "status": status,
        "weight": check["weight"],
        "finding": finding,
        "recommendation": recommendation,
        "evidence": evidence,
    }
