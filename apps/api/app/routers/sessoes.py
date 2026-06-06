from fastapi import APIRouter, Depends

from app.schemas.common import ApiEnvelope
from app.schemas.session import CurrentUser, SessionStartInput
from app.services.privacy.auth import get_optional_current_user
from app.services.privacy.session_service import start_session
from app.services.security.guardrails import safe_envelope

router = APIRouter()


@router.post("/iniciar", response_model=ApiEnvelope)
def iniciar_sessao(
    payload: SessionStartInput,
    current_user: CurrentUser | None = Depends(get_optional_current_user),
) -> ApiEnvelope:
    return safe_envelope(start_session(payload, current_user))
