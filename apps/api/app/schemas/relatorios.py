from datetime import date
from typing import Literal

from pydantic import Field

from app.schemas.common import (
    ConsentEvidence,
    ClientContext,
    NOT_INFORMED,
    ReportPurpose,
    SafetyWarning,
    StrictSchema,
)
from app.schemas.relatos import RelatoOriginal, RelatoRevisado


class ReportSectionItem(StrictSchema):
    label: str = Field(min_length=1, max_length=160)
    value: str = Field(default=NOT_INFORMED, max_length=2000)
    sensitive: bool = False


class ReportSection(StrictSchema):
    id: str = Field(min_length=1, max_length=80)
    title: str = Field(min_length=1, max_length=160)
    items: list[ReportSectionItem] = Field(default_factory=list, max_length=20)


class SuggestedQuestion(StrictSchema):
    category: Literal["observacao", "contexto", "rotina", "consulta", "registro", "seguranca"]
    text: str = Field(min_length=1, max_length=400)
    why_it_may_help: str = Field(default=NOT_INFORMED, max_length=500)


class StructuredReport(StrictSchema):
    title: str = Field(min_length=1, max_length=160)
    purpose: ReportPurpose
    period: str = Field(default=NOT_INFORMED, max_length=160)
    source_record_ids: list[str] = Field(default_factory=list, max_length=30)
    summary: str = Field(default=NOT_INFORMED, max_length=2000)
    sections: list[ReportSection] = Field(default_factory=list, max_length=12)
    suggested_questions: list[SuggestedQuestion] = Field(default_factory=list, max_length=8)
    safety_warnings: list[SafetyWarning] = Field(default_factory=list)
    missing_fields: dict[str, str] = Field(default_factory=dict)
    share_text: str = Field(default="", max_length=6000)


class GerarRelatorioRequest(StrictSchema):
    action_id: str = Field(min_length=1, max_length=120)
    consent: ConsentEvidence
    client_context: ClientContext = Field(default_factory=ClientContext)
    purpose: ReportPurpose
    original: RelatoOriginal
    revised: RelatoRevisado | None = None
    report_date: date | None = None
    source_record_ids: list[str] = Field(default_factory=list, max_length=30)


class GerarRelatorioResult(StrictSchema):
    report: StructuredReport


class PrepararConversaRequest(StrictSchema):
    action_id: str = Field(min_length=1, max_length=120)
    consent: ConsentEvidence
    client_context: ClientContext = Field(default_factory=ClientContext)
    purpose: ReportPurpose = ReportPurpose.CONVERSATION
    report: StructuredReport | None = None
    relato: RelatoOriginal | None = None
    max_questions: int = Field(default=5, ge=1, le=8)


class PerguntasSugeridasResult(StrictSchema):
    questions: list[SuggestedQuestion] = Field(default_factory=list, max_length=8)
    omitted: list[str] = Field(default_factory=list)
    user_can_edit: Literal[True] = True

