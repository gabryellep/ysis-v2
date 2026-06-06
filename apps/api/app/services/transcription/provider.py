from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from pathlib import Path
from tempfile import NamedTemporaryFile

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


class LocalWhisperTranscriptionProvider(TranscriptionProvider):
    name = "local"
    mode = "local"

    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    def transcribe(self, audio: TemporaryAudio, consent: AudioConsentEvidence) -> AudioTranscriptionResult:
        from faster_whisper import WhisperModel

        suffix = _suffix_for_content_type(audio.content_type)
        temp_path: str | None = None
        try:
            with NamedTemporaryFile(prefix="ysis-audio-", suffix=suffix, delete=False) as temp_file:
                temp_file.write(audio.data)
                temp_path = temp_file.name

            model = WhisperModel(self._settings.local_transcription_model, device="cpu", compute_type="int8")
            segments_iter, info = model.transcribe(temp_path, language="pt")
            segments: list[TranscriptionSegment] = []
            texts: list[str] = []
            for index, segment in enumerate(segments_iter):
                text = (segment.text or "").strip()
                if not text:
                    continue
                texts.append(text)
                segments.append(
                    TranscriptionSegment(
                        index=index,
                        text=text[:1200],
                        start_seconds=float(segment.start),
                        end_seconds=float(segment.end),
                    )
                )

            transcript = " ".join(texts).strip()
            return AudioTranscriptionResult(
                transcript=transcript,
                language=getattr(info, "language", None) or "pt-BR",
                segments=segments[:80],
                provider="local",
                provider_mode="local",
                attempted_provider="local",
                consent=consent,
                note="Transcricao local gerada com faster-whisper. Arquivo temporario descartado apos processamento.",
            )
        finally:
            if temp_path:
                Path(temp_path).unlink(missing_ok=True)


def get_transcription_provider(settings: Settings) -> TranscriptionProvider:
    if settings.transcription_real_configured:
        return OpenAITranscriptionProvider(settings)
    if settings.transcription_provider == "local":
        return LocalWhisperTranscriptionProvider(settings)
    return MockTranscriptionProvider()


def _suffix_for_content_type(content_type: str) -> str:
    if "wav" in content_type:
        return ".wav"
    if "ogg" in content_type:
        return ".ogg"
    if "mp4" in content_type:
        return ".mp4"
    return ".webm"
