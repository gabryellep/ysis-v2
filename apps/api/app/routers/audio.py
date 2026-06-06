from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.core.config import Settings, get_settings
from app.schemas.audio import AudioConsentEvidence
from app.schemas.common import ApiEnvelope, SafetyMetadata, SafetyWarning, SchemaMetadata
from app.services.transcription.provider import MockTranscriptionProvider, TemporaryAudio, get_transcription_provider

router = APIRouter()

ALLOWED_AUDIO_TYPES = {
    "audio/webm",
    "audio/mp4",
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/x-wav",
    "audio/ogg",
}


@router.post("/transcrever", response_model=ApiEnvelope)
async def transcrever_audio(
    audio: UploadFile = File(...),
    audio_consent_granted: bool = Form(...),
    consent_text_version: str = Form(...),
    discreet_mode: bool = Form(False),
    settings: Settings = Depends(get_settings),
) -> ApiEnvelope:
    if not audio_consent_granted:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Consentimento de audio/transcricao e obrigatorio.")

    content_type = (audio.content_type or "").split(";")[0].strip().lower()
    if content_type not in ALLOWED_AUDIO_TYPES:
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail="Tipo de audio nao suportado.")

    data = await audio.read()
    max_bytes = settings.transcription_max_upload_mb * 1024 * 1024
    if not data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Arquivo de audio vazio.")
    if len(data) > max_bytes:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Arquivo de audio acima do limite.")

    consent = AudioConsentEvidence(
        granted=True,
        text_version=consent_text_version,
        scopes=["audio_to_transcription", "temporary_processing"],
    )

    provider = get_transcription_provider(settings)
    attempted_provider = provider.name

    try:
        result = provider.transcribe(
            TemporaryAudio(filename=audio.filename or "ysis-audio", content_type=content_type, data=data),
            consent=consent,
        )
    except Exception as exc:
        result = MockTranscriptionProvider().transcribe(
            TemporaryAudio(filename="fallback", content_type=content_type, data=b"fallback"),
            consent=consent,
        )
        result = result.model_copy(
            update={
                "attempted_provider": attempted_provider,
                "fallback_reason": exc.__class__.__name__,
                "note": "Fallback seguro: a transcricao real falhou. Nenhum audio foi salvo.",
            }
        )
        return _audio_envelope(result.model_dump(), ok=False, fallback_used=True, discreet_mode=discreet_mode)
    finally:
        data = b""
        await audio.close()

    return _audio_envelope(result.model_dump(), ok=True, fallback_used=False, discreet_mode=discreet_mode)


def _audio_envelope(result: dict, ok: bool, fallback_used: bool, discreet_mode: bool) -> ApiEnvelope:
    warnings = [
        SafetyWarning(
            code="transcription_requires_review",
            message="Revise e edite a transcricao antes de continuar.",
            severity="info",
            source="system",
        )
    ]
    if fallback_used:
        warnings.append(
            SafetyWarning(
                code="transcription_fallback",
                message=f"Nao foi possivel transcrever com {result.get('attempted_provider')}. O retorno mock e apenas um rascunho seguro.",
                severity="attention",
                source="system",
            )
        )

    limitations = [
        "Audio processado temporariamente no backend e descartado apos a resposta.",
        "Transcricao precisa ser revisada, editada ou apagada pela usuaria.",
        "Nenhum audio ou transcricao e persistido por padrao.",
    ]
    if discreet_mode:
        limitations[1] = "Texto gerado precisa ser revisado, editado ou apagado antes de seguir."

    return ApiEnvelope(
        ok=ok,
        metadata=SchemaMetadata(model_version=f"ysis-transcription-{result['provider']}.phase7a"),
        limitations=limitations,
        safety=SafetyMetadata(fallback_used=fallback_used, warnings=warnings),
        result=result,
    )
