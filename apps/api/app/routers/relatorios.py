from fastapi import APIRouter, Depends, HTTPException, status

from app.core.config import Settings, get_settings
from app.schemas.common import ApiEnvelope
from app.schemas.relatorios import GerarRelatorioRequest
from app.services.reports.provider import (
    REPORT_GENERATION_PROMPT_VERSION,
    MockReportProvider,
    get_report_provider,
)
from app.services.security.guardrails import safe_envelope, safe_fallback
from app.services.security.safety import collect_forbidden_terms

router = APIRouter()


@router.post("/gerar", response_model=ApiEnvelope)
def gerar_relatorio(payload: GerarRelatorioRequest, settings: Settings = Depends(get_settings)) -> ApiEnvelope:
    if "ai_processing" not in payload.consent.scopes:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Consentimento especifico para processamento por IA e obrigatorio.",
        )

    blocked_terms = collect_forbidden_terms(payload.model_dump(mode="json"))
    if blocked_terms:
        return safe_fallback(
            blocked_terms,
            prompt_version=REPORT_GENERATION_PROMPT_VERSION,
            model_version="ysis-report-guardrail.phase8",
        )

    provider = get_report_provider(settings)
    try:
        result = provider.generate_report(payload)
    except Exception as exc:
        result = MockReportProvider().generate_report(payload)
        result.report.provider = "mock"
        result.report.provider_mode = "mock"
        result.report.fallback_message = (
            f"Fallback seguro apos falha do provider {provider.name}: {exc.__class__.__name__}. "
            "Revise manualmente. Nenhum relato foi salvo automaticamente."
        )
        return safe_envelope(
            result,
            ok=False,
            prompt_version=REPORT_GENERATION_PROMPT_VERSION,
            model_version=f"ysis-report-{provider.name}-fallback.phase8",
        )

    return safe_envelope(
        result,
        prompt_version=REPORT_GENERATION_PROMPT_VERSION,
        model_version=f"ysis-report-{provider.name}-{provider.model_version}",
    )
