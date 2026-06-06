from datetime import datetime

from fastapi import APIRouter

from app.schemas.common import ApiEnvelope
from app.schemas.privacy import (
    ConsentLogInput,
    ConsentLogResult,
    PrivacyControlState,
    PrivacyEventInput,
    PrivacyEventResult,
)
from app.services.security.guardrails import safe_envelope

router = APIRouter()


@router.get("/controle", response_model=ApiEnvelope)
def privacidade_controle() -> ApiEnvelope:
    return safe_envelope(
        PrivacyControlState(
            retention_note=(
                "Fase 5 usa controle backend demonstrativo sem persistencia. "
                "Modo convidada nao deve salvar dados sensiveis permanentemente."
            )
        )
    )


@router.post("/consentimentos", response_model=ApiEnvelope)
def registrar_consentimento(payload: ConsentLogInput) -> ApiEnvelope:
    result = ConsentLogResult(
        accepted=payload.decision == "granted",
        consent_type=payload.consent_type,
        decision=payload.decision,
        received_at=datetime.utcnow(),
        note="Consentimento validado no backend. Persistencia real entra com Supabase/Auth.",
    )
    return safe_envelope(result)


@router.post("/eventos", response_model=ApiEnvelope)
def registrar_evento_privacidade(payload: PrivacyEventInput) -> ApiEnvelope:
    result = PrivacyEventResult(
        accepted=True,
        event_type=payload.event_type,
        category=payload.category,
        received_at=datetime.utcnow(),
        note="Evento recebido pelo backend. Persistencia real entra com Supabase/RLS.",
    )
    return safe_envelope(result)
