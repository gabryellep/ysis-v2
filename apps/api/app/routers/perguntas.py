from fastapi import APIRouter

from app.schemas.common import FoundationResponse

router = APIRouter()


@router.post("/sugeridas", response_model=FoundationResponse)
def perguntas_sugeridas_placeholder() -> FoundationResponse:
    return FoundationResponse(
        status="planned",
        message="Endpoint reservado para perguntas opcionais que a usuaria pode levar ao especialista.",
    )
