from __future__ import annotations

import re
import unicodedata
from typing import Any

from app.schemas.common import REVIEW_NOTICE, SafetyWarning

NO_DIAGNOSIS_MESSAGE = REVIEW_NOTICE
URGENT_CARE_GUIDANCE = (
    "Em caso de dor intensa, febre, sangramento importante, piora rapida "
    "ou mal-estar intenso, busque atendimento de urgencia."
)

FORBIDDEN_LANGUAGE_PATTERNS = [
    "voce tem",
    "voce esta com",
    "voce pode estar com",
    "isso indica",
    "isso sugere",
    "isso e sinal de",
    "e sinal de",
    "sintoma de",
    "quadro de",
    "compativel com",
    "provavelmente e",
    "provavelmente seja",
    "provavelmente nao e nada",
    "isso e normal",
    "doenca provavel",
    "causa provavel",
    "hipotese diagnostica",
    "diagnostico provavel",
    "diagnostico",
    "o tratamento e",
    "tratamento indicado",
    "tratamento recomendado",
    "recomendo tratamento",
    "que remedio",
    "qual remedio",
    "devo tomar",
    "posso tomar",
    "voce deve tomar",
    "tome ",
    "use remedio",
    "use medicamento",
    "me prescreva",
    "receite",
    "prescrevo",
    "prescricao",
    "conclusao sobre",
    "foi abuso",
    "isso foi abuso",
    "voce sofreu abuso",
    "voce foi abusada",
    "foi violencia",
    "isso foi violencia",
    "voce sofreu violencia",
    "foi estupro",
]

SAFE_NEGATION_PATTERNS = [
    "nao realiza diagnostico",
    "nao faz diagnostico",
    "nao contem diagnostico",
    "sem diagnostico",
    "sem conclusao diagnostica",
    "nao conclui condicao clinica",
    "nao recomenda tratamento",
    "nao orienta tratamento",
    "nao substitui consulta",
    "nao substitui profissional",
    "nao prescreve remedio",
    "nao prescreve medicamentos",
    "nao conclui violencia",
    "nao conclui abuso",
    "sem concluir violencia",
    "sem concluir abuso",
]

SAFE_LANGUAGE_ALTERNATIVES = {
    "voce tem": "o relato registra",
    "voce esta com": "o relato descreve",
    "voce pode estar com": "os sinais registrados podem ser organizados para conversa com profissional",
    "isso indica": "o relato registrado pede acompanhamento",
    "isso sugere": "o relato registrado pode apoiar uma conversa de cuidado",
    "isso e sinal de": "isso foi relatado junto de",
    "e sinal de": "foi relatado junto de",
    "sintoma de": "relato de",
    "quadro de": "conjunto de relatos",
    "compativel com": "registrado junto de",
    "provavelmente e": "foi informado como",
    "provavelmente seja": "foi informado como",
    "provavelmente nao e nada": "merece ser observado e revisado com apoio profissional se houver preocupacao",
    "isso e normal": "isso pode ser registrado para conversa com profissional se causar duvida ou preocupacao",
    "diagnostico": "avaliacao profissional",
    "tratamento": "orientacao profissional",
    "prescricao": "orientacao profissional",
    "foi abuso": "foi relatado como uma situacao sensivel",
    "isso foi abuso": "isso foi relatado como uma situacao sensivel",
    "voce sofreu abuso": "voce relatou uma situacao sensivel",
    "voce foi abusada": "voce relatou uma situacao sensivel",
    "foi violencia": "foi relatado como uma situacao sensivel",
    "isso foi violencia": "isso foi relatado como uma situacao sensivel",
    "voce sofreu violencia": "voce relatou uma situacao sensivel",
    "foi estupro": "foi relatado como uma situacao sensivel",
}

SENSITIVE_CONCLUSION_PATTERNS = {
    "foi abuso",
    "isso foi abuso",
    "voce sofreu abuso",
    "voce foi abusada",
    "foi violencia",
    "isso foi violencia",
    "voce sofreu violencia",
    "foi estupro",
}


def normalize_for_safety(value: str) -> str:
    lowered = value.lower()
    normalized = unicodedata.normalize("NFD", lowered)
    return "".join(char for char in normalized if unicodedata.category(char) != "Mn")


def _is_safely_negated(normalized_text: str, normalized_pattern: str) -> bool:
    if normalized_pattern in {normalize_for_safety(pattern) for pattern in SENSITIVE_CONCLUSION_PATTERNS}:
        return False

    sentences = re.split(r"[.!?\n]+", normalized_text)
    return any(
        normalized_pattern in sentence
        and any(safe in sentence for safe in SAFE_NEGATION_PATTERNS)
        for sentence in sentences
    )


def find_forbidden_terms_in_text(text: str) -> list[str]:
    normalized_text = normalize_for_safety(text)
    found: list[str] = []
    for pattern in FORBIDDEN_LANGUAGE_PATTERNS:
        normalized_pattern = normalize_for_safety(pattern)
        if normalized_pattern in normalized_text and not _is_safely_negated(
            normalized_text, normalized_pattern
        ):
            found.append(pattern)
    return sorted(set(found))


def contains_forbidden_language(text: str) -> bool:
    return len(find_forbidden_terms_in_text(text)) > 0


def sanitize_safety_language(text: str) -> str:
    safe_text = text
    for pattern, alternative in SAFE_LANGUAGE_ALTERNATIVES.items():
        safe_text = re.sub(re.escape(pattern), alternative, safe_text, flags=re.IGNORECASE)
    return safe_text


def collect_forbidden_terms(value: Any) -> list[str]:
    if isinstance(value, str):
        return find_forbidden_terms_in_text(value)
    if isinstance(value, list):
        return sorted(set(term for item in value for term in collect_forbidden_terms(item)))
    if isinstance(value, dict):
        return sorted(set(term for item in value.values() for term in collect_forbidden_terms(item)))
    return []


def default_safety_warnings(blocked_terms: list[str] | None = None) -> list[SafetyWarning]:
    warnings = [
        SafetyWarning(
            code="non_diagnostic",
            message=NO_DIAGNOSIS_MESSAGE,
            severity="info",
            source="system",
        )
    ]
    if blocked_terms:
        warnings.append(
            SafetyWarning(
                code="diagnostic_or_prescriptive_language_detected",
                message="Algumas frases foram bloqueadas ou suavizadas por parecerem diagnosticas, prescritivas ou conclusivas.",
                severity="attention",
                source="input",
            )
        )
    return warnings
