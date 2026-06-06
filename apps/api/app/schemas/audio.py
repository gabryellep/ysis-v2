from datetime import datetime
from typing import Literal

from pydantic import Field

from app.schemas.common import StrictSchema


class AudioConsentEvidence(StrictSchema):
    granted: Literal[True]
    text_version: str = Field(min_length=1, max_length=120)
    scopes: list[str] = Field(default_factory=list, max_length=8)


class TranscriptionSegment(StrictSchema):
    index: int = Field(ge=0)
    text: str = Field(max_length=1200)
    start_seconds: float | None = Field(default=None, ge=0)
    end_seconds: float | None = Field(default=None, ge=0)


class AudioTranscriptionResult(StrictSchema):
    transcript: str = Field(max_length=20000)
    language: str = "pt-BR"
    segments: list[TranscriptionSegment] = Field(default_factory=list, max_length=80)
    provider: Literal["mock", "openai", "local"]
    provider_mode: Literal["mock", "real", "local"]
    attempted_provider: Literal["mock", "openai", "local"] | None = None
    fallback_reason: str | None = Field(default=None, max_length=120)
    audio_saved: Literal[False] = False
    persisted: Literal[False] = False
    review_required: Literal[True] = True
    consent: AudioConsentEvidence
    received_at: datetime = Field(default_factory=datetime.utcnow)
    note: str
