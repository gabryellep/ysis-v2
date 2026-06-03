from fastapi import FastAPI

from app.routers import audio, historico, perguntas, privacidade, relatos, relatorios

app = FastAPI(
    title="Ysis V2 API",
    version="0.1.0",
    description="Base FastAPI para relatos, voz, relatorios, perguntas sugeridas, historico e privacidade.",
)

app.include_router(audio.router, prefix="/audio", tags=["audio"])
app.include_router(relatos.router, prefix="/relatos", tags=["relatos"])
app.include_router(relatorios.router, prefix="/relatorios", tags=["relatorios"])
app.include_router(perguntas.router, prefix="/perguntas", tags=["perguntas"])
app.include_router(historico.router, prefix="/historico", tags=["historico"])
app.include_router(privacidade.router, prefix="/privacidade", tags=["privacidade"])


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "scope": "foundation-only"}
