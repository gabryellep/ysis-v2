from datetime import date
from typing import Literal

from pydantic import Field, field_validator

from app.schemas.common import (
    ConsentEvidence,
    ClientContext,
    NOT_INFORMED,
    SafetyWarning,
    StrictSchema,
)


class RelatoOriginal(StrictSchema):
    text: str = Field(min_length=1, max_length=8000)
    input_mode: Literal["written", "voice_transcript", "mixed"] = "written"
    reported_on: date | None = None
    language: Literal["pt-BR"] = "pt-BR"

    @field_validator("text")
    @classmethod
    def trim_text(cls, value: str) -> str:
        return value.strip()


class RelatoRevisado(StrictSchema):
    short: str = Field(default=NOT_INFORMED, max_length=1200)
    medium: str = Field(default=NOT_INFORMED, max_length=3000)
    complete: str = Field(default=NOT_INFORMED, max_length=8000)
    user_can_edit: Literal[True] = True


class RelatoTopic(StrictSchema):
    label: str = Field(min_length=1, max_length=120)
    user_words: list[str] = Field(default_factory=list, max_length=12)
    note: str = Field(default=NOT_INFORMED, max_length=600)


class SuggestedFields(StrictSchema):
    main_description: str = Field(default=NOT_INFORMED, max_length=2000)
    associated_notes: list[str] = Field(default_factory=list, max_length=12)
    cycle_relation_text: str = Field(default=NOT_INFORMED, max_length=600)
    emotional_context_text: str = Field(default=NOT_INFORMED, max_length=600)
    sensitive_notes: str = Field(default=NOT_INFORMED, max_length=600)


class OrganizarRelatoRequest(StrictSchema):
    action_id: str = Field(min_length=1, max_length=120)
    consent: ConsentEvidence
    client_context: ClientContext = Field(default_factory=ClientContext)
    original: RelatoOriginal
    known_context: str | None = Field(default=None, max_length=2000)


class OrganizarRelatoResult(StrictSchema):
    original: RelatoOriginal
    revised: RelatoRevisado
    topics: list[RelatoTopic] = Field(default_factory=list, max_length=12)
    suggested_fields: SuggestedFields = Field(default_factory=SuggestedFields)
    revision_questions: list[str] = Field(default_factory=list, max_length=8)
    missing_fields: dict[str, str] = Field(default_factory=dict)
    warnings: list[SafetyWarning] = Field(default_factory=list)

