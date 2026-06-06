from fastapi import APIRouter

from app.schemas.common import ApiEnvelope
from app.schemas.relatorios import GerarRelatorioRequest
from app.services.reports.demo_generator import generate_demo_report
from app.services.security.guardrails import safe_envelope, safe_fallback
from app.services.security.safety import collect_forbidden_terms

router = APIRouter()


@router.post("/gerar", response_model=ApiEnvelope)
def gerar_relatorio(payload: GerarRelatorioRequest) -> ApiEnvelope:
    blocked_terms = collect_forbidden_terms(payload.model_dump(mode="json"))
    if blocked_terms:
        return safe_fallback(blocked_terms)

    result = generate_demo_report(payload)
    return safe_envelope(result)
