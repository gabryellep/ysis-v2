from fastapi import APIRouter

from app.schemas.common import FoundationResponse

router = APIRouter()


@router.get("/controle", response_model=FoundationResponse)
def privacidade_placeholder() -> FoundationResponse:
    return FoundationResponse(
        status="planned",
        message="Endpoint reservado para consentimentos, modo discreto, exportacao e exclusao.",
    )
