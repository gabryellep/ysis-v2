from fastapi import APIRouter

from app.schemas.common import FoundationResponse

router = APIRouter()


@router.get("/", response_model=FoundationResponse)
def historico_placeholder() -> FoundationResponse:
    return FoundationResponse(
        status="planned",
        message="Endpoint reservado para historico opcional, exportavel e apagavel.",
    )
