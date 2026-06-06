from __future__ import annotations

from typing import Any

from pydantic import BaseModel

from app.schemas.common import ApiEnvelope, SafetyMetadata, SchemaMetadata
from app.services.security.safety import (
    collect_forbidden_terms,
    default_safety_warnings,
    sanitize_safety_language,
)


def sanitize_nested(value: Any) -> Any:
    if isinstance(value, str):
        return sanitize_safety_language(value)
    if isinstance(value, list):
        return [sanitize_nested(item) for item in value]
    if isinstance(value, dict):
        return {key: sanitize_nested(item) for key, item in value.items()}
    return value


def model_to_safe_dict(model: BaseModel) -> dict[str, Any]:
    return sanitize_nested(model.model_dump(mode="json"))


def validate_output_or_fallback(result: BaseModel | dict[str, Any]) -> tuple[dict[str, Any], SafetyMetadata]:
    raw = result.model_dump(mode="json") if isinstance(result, BaseModel) else result
    blocked_terms = collect_forbidden_terms(raw)
    safe_result = sanitize_nested(raw)
    remaining_terms = collect_forbidden_terms(safe_result)
    fallback_used = bool(remaining_terms)

    if fallback_used:
        safe_result = {
            "message": "Nao foi possivel gerar uma resposta automatica segura agora. Revise o relato manualmente.",
            "review_required": True,
        }

    return safe_result, SafetyMetadata(
        blocked_terms_found=blocked_terms,
        fallback_used=fallback_used,
        warnings=default_safety_warnings(blocked_terms),
    )


def safe_envelope(result: BaseModel | dict[str, Any], ok: bool = True) -> ApiEnvelope:
    safe_result, safety = validate_output_or_fallback(result)
    return ApiEnvelope(
        ok=ok and not safety.fallback_used,
        metadata=SchemaMetadata(),
        safety=safety,
        result=safe_result,
    )


def safe_fallback(blocked_terms: list[str] | None = None) -> ApiEnvelope:
    return ApiEnvelope(
        ok=False,
        metadata=SchemaMetadata(),
        safety=SafetyMetadata(
            blocked_terms_found=blocked_terms or [],
            fallback_used=True,
            warnings=default_safety_warnings(blocked_terms or []),
        ),
        result={
            "message": "Nao foi possivel processar automaticamente com seguranca. Nada foi salvo automaticamente.",
            "review_required": True,
        },
    )
