from fastapi import APIRouter

from app.schemas.common import FoundationResponse

router = APIRouter()


@router.post("/gerar", response_model=FoundationResponse)
def gerar_relatorio_placeholder() -> FoundationResponse:
    return FoundationResponse(
        status="planned",
        message="Endpoint reservado para relatorios por finalidade, sempre revisaveis pela usuaria.",
    )
