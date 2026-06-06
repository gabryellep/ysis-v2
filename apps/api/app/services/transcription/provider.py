from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass

from app.core.config import Settings
from app.schemas.audio import AudioConsentEvidence, AudioTranscriptionResult, TranscriptionSegment


@dataclass(frozen=True)
class TemporaryAudio:
    filename: str
    content_type: str
    data: bytes


class TranscriptionProvider(ABC):
    name: str
    mode: str

    @abstractmethod
    def transcribe(self, audio: TemporaryAudio, consent: AudioConsentEvidence) -> AudioTranscriptionResult:
        raise NotImplementedError


class MockTranscriptionProvider(TranscriptionProvider):
    name = "mock"
    mode = "mock"

    def transcribe(self, audio: TemporaryAudio, consent: AudioConsentEvidence) -> AudioTranscriptionResult:
        return AudioTranscriptionResult(
            transcript=(
                "Transcricao mock para revisao. O audio foi recebido temporariamente, nao foi salvo "
                "e deve ser substituido pela fala revisada pela usuaria."
            ),
            segments=[
                TranscriptionSegment(
                    index=0,
                    text="Transcricao mock para revisao. O audio nao foi salvo.",
                    start_seconds=None,
                    end_seconds=None,
                )
            ],
            provider="mock",
            provider_mode="mock",
            attempted_provider="mock",
            consent=consent,
            note="Modo mock: nenhuma transcricao real foi executada.",
        )


class OpenAITranscriptionProvider(TranscriptionProvider):
    name = "openai"
    mode = "real"

    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    def transcribe(self, audio: TemporaryAudio, consent: AudioConsentEvidence) -> AudioTranscriptionResult:
        from io import BytesIO

        from openai import OpenAI

        client = OpenAI(api_key=self._settings.openai_api_key)
        file_obj = BytesIO(audio.data)
        file_obj.name = audio.filename or "ysis-audio.webm"

        response = client.audio.transcriptions.create(
            model=self._settings.transcription_model,
            file=file_obj,
            response_format="json",
        )
        text = getattr(response, "text", "") or ""

        return AudioTranscriptionResult(
            transcript=text,
            segments=[TranscriptionSegment(index=0, text=text[:1200])] if text else [],
            provider="openai",
            provider_mode="real",
            attempted_provider="openai",
            consent=consent,
            note="Transcricao real gerada no backend. Audio temporario descartado apos processamento.",
        )


def get_transcription_provider(settings: Settings) -> TranscriptionProvider:
    if settings.transcription_real_configured:
        return OpenAITranscriptionProvider(settings)
    return MockTranscriptionProvider()
