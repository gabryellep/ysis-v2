from fastapi import APIRouter

from app.schemas.common import ApiEnvelope
from app.schemas.relatorios import PrepararConversaRequest
from app.services.ai.mock_provider import suggest_questions_mock
from app.services.security.guardrails import safe_envelope, safe_fallback
from app.services.security.safety import collect_forbidden_terms

router = APIRouter()


@router.post("/sugeridas", response_model=ApiEnvelope)
def perguntas_sugeridas(payload: PrepararConversaRequest) -> ApiEnvelope:
    blocked_terms = collect_forbidden_terms(payload.model_dump(mode="json"))
    if blocked_terms:
        return safe_fallback(blocked_terms)

    result = suggest_questions_mock(payload)
    return safe_envelope(result)
