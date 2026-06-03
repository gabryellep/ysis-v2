from fastapi import APIRouter

from app.schemas.common import FoundationResponse

router = APIRouter()


@router.post("/transcrever", response_model=FoundationResponse)
def transcrever_audio_placeholder() -> FoundationResponse:
    return FoundationResponse(
        status="planned",
        message="Endpoint reservado. Transcricao real sera implementada com consentimento explicito e sem salvar audio por padrao.",
    )
