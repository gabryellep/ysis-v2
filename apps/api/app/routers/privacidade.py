from fastapi import APIRouter, Depends

from app.schemas.common import ApiEnvelope
from app.schemas.privacy import (
    PrivacyControlState,
    ConsentLogInput,
    PrivacyEventInput,
)
from app.schemas.session import CurrentUser
from app.services.privacy.auth import get_optional_current_user
from app.services.privacy.consent_service import register_consent
from app.services.privacy.privacy_event_service import register_privacy_event
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
def registrar_consentimento(
    payload: ConsentLogInput,
    current_user: CurrentUser | None = Depends(get_optional_current_user),
) -> ApiEnvelope:
    return safe_envelope(register_consent(payload, current_user))


@router.post("/eventos", response_model=ApiEnvelope)
def registrar_evento_privacidade(
    payload: PrivacyEventInput,
    current_user: CurrentUser | None = Depends(get_optional_current_user),
) -> ApiEnvelope:
    return safe_envelope(register_privacy_event(payload, current_user))
