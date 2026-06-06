from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routers import audio, historico, perguntas, privacidade, relatos, relatorios, sessoes

app = FastAPI(
    title="Ysis V2 API",
    version="0.1.0",
    description="Base FastAPI para relatos, voz, relatorios, perguntas sugeridas, historico e privacidade.",
)

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.parsed_cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(audio.router, prefix="/audio", tags=["audio"])
app.include_router(relatos.router, prefix="/relatos", tags=["relatos"])
app.include_router(relatorios.router, prefix="/relatorios", tags=["relatorios"])
app.include_router(perguntas.router, prefix="/perguntas", tags=["perguntas"])
app.include_router(historico.router, prefix="/historico", tags=["historico"])
app.include_router(privacidade.router, prefix="/privacidade", tags=["privacidade"])
app.include_router(sessoes.router, prefix="/sessoes", tags=["sessoes"])


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "scope": "foundation-only"}
