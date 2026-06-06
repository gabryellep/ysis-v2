from __future__ import annotations

from pydantic import Field

from app.schemas.common import NOT_INFORMED, SafetyWarning, StrictSchema
from app.schemas.relatos import (
    OrganizarRelatoRequest,
    OrganizarRelatoResult,
    RelatoRevisado,
    RelatoTopic,
    SuggestedFields,
)
from app.services.security.safety import sanitize_safety_language


class LLMRelatoOrganization(StrictSchema):
    organized_summary: str = Field(max_length=1200)
    main_points: list[str] = Field(max_length=8)
    reported_symptoms_or_situations: list[str] = Field(max_length=12)
    informed_context: list[str] = Field(max_length=12)
    missing_information: dict[str, str] = Field(max_length=12)
    careful_questions: list[str] = Field(max_length=8)
    non_diagnostic_notice: str = Field(max_length=600)
    safety_flags: list[str] = Field(max_length=8)


def relato_json_schema() -> dict:
    return LLMRelatoOrganization.model_json_schema()


def _clean_text(value: str, max_length: int) -> str:
    clean = sanitize_safety_language((value or NOT_INFORMED).strip()) or NOT_INFORMED
    if len(clean) <= max_length:
        return clean
    return f"{clean[: max_length - 3].strip()}..."


def llm_output_to_result(
    request: OrganizarRelatoRequest,
    output: LLMRelatoOrganization,
    provider: str,
    provider_mode: str,
    fallback_reason: str | None = None,
) -> OrganizarRelatoResult:
    summary = _clean_text(output.organized_summary, 1200)
    complete_parts = [
        f"Resumo organizado: {summary}",
        "Pontos principais: " + "; ".join(_clean_text(item, 220) for item in output.main_points) if output.main_points else "",
        "Contexto informado: " + "; ".join(_clean_text(item, 220) for item in output.informed_context) if output.informed_context else "",
        _clean_text(output.non_diagnostic_notice, 600),
    ]
    complete = "\n\n".join(part for part in complete_parts if part)

    notice = _clean_text(output.non_diagnostic_notice, 600)
    if notice == NOT_INFORMED:
        notice = "Rascunho revisavel, sem avaliacao clinica, recomendacao de cuidado ou conclusao sensivel."

    return OrganizarRelatoResult(
        original=request.original,
        revised=RelatoRevisado(
            short=_clean_text(summary, 900),
            medium=_clean_text(complete, 3000),
            complete=_clean_text(complete, 8000),
        ),
        topics=[
            RelatoTopic(
                label=_clean_text(item, 120),
                user_words=[],
                note="Ponto extraido do relato para revisao da usuaria.",
            )
            for item in output.main_points[:8]
        ],
        suggested_fields=SuggestedFields(
            main_description=summary,
            associated_notes=[_clean_text(item, 300) for item in output.reported_symptoms_or_situations[:12]],
            cycle_relation_text=_clean_text(output.missing_information.get("relacao_com_ciclo", NOT_INFORMED), 600),
            emotional_context_text=_clean_text("; ".join(output.informed_context) if output.informed_context else NOT_INFORMED, 600),
            sensitive_notes=_clean_text("; ".join(output.safety_flags) if output.safety_flags else NOT_INFORMED, 600),
        ),
        revision_questions=[_clean_text(item, 240) for item in output.careful_questions[:8]],
        missing_fields={key: _clean_text(value, 300) for key, value in output.missing_information.items()},
        warnings=[
            SafetyWarning(
                code="ai_output_requires_review",
                message="Revise e edite toda organizacao antes de usar.",
                severity="info",
                source="system",
            )
        ],
        provider=provider,  # type: ignore[arg-type]
        provider_mode=provider_mode,  # type: ignore[arg-type]
        attempted_provider=provider,  # type: ignore[arg-type]
        fallback_reason=fallback_reason,
        diagnostic_notice=notice,
    )
