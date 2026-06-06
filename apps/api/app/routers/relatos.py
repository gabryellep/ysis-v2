from fastapi import APIRouter, Depends, HTTPException, status

from app.core.config import Settings, get_settings
from app.schemas.common import ApiEnvelope
from app.schemas.relatos import OrganizarRelatoRequest
from app.services.ai.prompts import RELATO_ORGANIZATION_PROMPT_VERSION
from app.services.ai.provider import MockAIProvider, get_ai_provider
from app.services.security.guardrails import safe_envelope, safe_fallback
from app.services.security.safety import collect_forbidden_terms

router = APIRouter()


@router.post("/organizar", response_model=ApiEnvelope)
def organizar_relato(payload: OrganizarRelatoRequest, settings: Settings = Depends(get_settings)) -> ApiEnvelope:
    if "ai_processing" not in payload.consent.scopes:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Consentimento especifico para processamento por IA e obrigatorio.",
        )

    blocked_terms = collect_forbidden_terms(payload.original.text)
    if blocked_terms:
        return safe_fallback(
            blocked_terms,
            prompt_version=RELATO_ORGANIZATION_PROMPT_VERSION,
            model_version="ysis-ai-guardrail.phase7b",
        )

    provider = get_ai_provider(settings)
    try:
        result = provider.organize_relato(payload)
    except Exception as exc:
        result = MockAIProvider().organize_relato(payload).model_copy(
            update={
                "attempted_provider": provider.name,
                "fallback_reason": exc.__class__.__name__,
                "diagnostic_notice": "Fallback seguro: revise manualmente. Nenhum relato foi salvo automaticamente.",
            }
        )
        return safe_envelope(
            result,
            ok=False,
            prompt_version=RELATO_ORGANIZATION_PROMPT_VERSION,
            model_version=f"ysis-ai-{provider.name}-fallback.phase7b",
        )

    return safe_envelope(
        result,
        prompt_version=RELATO_ORGANIZATION_PROMPT_VERSION,
        model_version=f"ysis-ai-{provider.name}-{provider.model_version}",
    )
