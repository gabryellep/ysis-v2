from fastapi import APIRouter

from app.schemas.common import FoundationResponse

router = APIRouter()


@router.post("/organizar", response_model=FoundationResponse)
def organizar_relato_placeholder() -> FoundationResponse:
    return FoundationResponse(
        status="planned",
        message="Endpoint reservado para organizar relatos revisaveis, sem diagnostico e sem prescricao.",
    )
