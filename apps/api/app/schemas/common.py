from datetime import datetime
from enum import StrEnum
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field


class FoundationResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    status: str
    message: str


NOT_INFORMED = "nao informado"
SCHEMA_VERSION = "ysis.v2.phase5.0"
MOCK_MODEL_VERSION = "ysis-mock-provider.phase5.0"
PROMPT_VERSION = "ysis-safe-mock.phase5.0"
REVIEW_NOTICE = (
    "A Ysis organiza informacoes relatadas para revisao da usuaria. "
    "Nao diagnostica, nao prescreve e nao substitui profissionais de saude."
)


class StrictSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")


class Locale(StrEnum):
    PT_BR = "pt-BR"


class ReportPurpose(StrEnum):
    CONSULTATION = "consultation"
    SYMPTOMS = "symptoms"
    CONVERSATION = "conversation"
    PERSONAL = "personal"
    GYNECOLOGIST = "gynecologist"
    PSYCHOLOGIST = "psychologist"
    OBSTETRICS = "obstetrics"
    URGENT_CARE = "urgent_care"
    SENSITIVE_SITUATION = "sensitive_situation"


class ProcessingMode(StrEnum):
    GUEST = "guest"
    ACCOUNT = "account"


class ConsentEvidence(StrictSchema):
    granted: Literal[True]
    text_version: str = Field(min_length=1, max_length=120)
    granted_at: datetime
    scopes: list[str] = Field(default_factory=list, max_length=12)


class ClientContext(StrictSchema):
    mode: ProcessingMode = ProcessingMode.GUEST
    discreet_mode: bool = False
    source_screen: str = Field(default="ferramenta", min_length=1, max_length=80)
    session_id: str | None = Field(default=None, max_length=120)


class SchemaMetadata(StrictSchema):
    schema_version: str = SCHEMA_VERSION
    prompt_version: str = PROMPT_VERSION
    model_version: str = MOCK_MODEL_VERSION
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    review_required: Literal[True] = True


class SafetyWarning(StrictSchema):
    code: str = Field(min_length=1, max_length=80)
    message: str = Field(min_length=1, max_length=600)
    severity: Literal["info", "attention", "blocked"] = "info"
    source: Literal["input", "output", "system"] = "system"


class SafetyMetadata(StrictSchema):
    blocked_terms_found: list[str] = Field(default_factory=list)
    fallback_used: bool = False
    warnings: list[SafetyWarning] = Field(default_factory=list)


class ApiEnvelope(StrictSchema):
    ok: bool
    metadata: SchemaMetadata = Field(default_factory=SchemaMetadata)
    neutral_notice: str = REVIEW_NOTICE
    limitations: list[str] = Field(
        default_factory=lambda: [
            "Use como rascunho revisavel.",
            "Procure apoio profissional para avaliacao, conduta ou urgencia.",
        ]
    )
    safety: SafetyMetadata = Field(default_factory=SafetyMetadata)
    result: dict[str, Any]
