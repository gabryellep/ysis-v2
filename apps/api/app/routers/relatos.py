from fastapi import APIRouter

from app.schemas.common import ApiEnvelope
from app.schemas.relatos import OrganizarRelatoRequest
from app.services.ai.mock_provider import organize_report_mock
from app.services.security.guardrails import safe_envelope, safe_fallback
from app.services.security.safety import collect_forbidden_terms

router = APIRouter()


@router.post("/organizar", response_model=ApiEnvelope)
def organizar_relato(payload: OrganizarRelatoRequest) -> ApiEnvelope:
    blocked_terms = collect_forbidden_terms(payload.original.text)
    if blocked_terms:
        return safe_fallback(blocked_terms)

    result = organize_report_mock(payload)
    return safe_envelope(result)
