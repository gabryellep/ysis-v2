from datetime import datetime
from typing import Literal

from pydantic import Field

from app.schemas.common import ConsentEvidence, StrictSchema


class ConsentLogInput(StrictSchema):
    consent: ConsentEvidence
    consent_type: Literal[
        "tool_processing",
        "ai_processing",
        "cloud_sync",
        "report_generation",
        "privacy_control",
    ]
    decision: Literal["granted", "revoked", "declined"]
    source: str = Field(default="ferramenta", max_length=80)


class ConsentLogResult(StrictSchema):
    accepted: bool
    consent_type: str
    decision: str
    received_at: datetime
    persisted: Literal[False] = False
    note: str


class PrivacyEventInput(StrictSchema):
    event_type: Literal[
        "session_deleted",
        "discreet_mode_enabled",
        "discreet_mode_disabled",
        "export_requested",
        "delete_requested",
    ]
    category: Literal["guest_session", "symptom_records", "reports", "all_local_data"]
    source: str = Field(default="ferramenta", max_length=80)


class PrivacyControlState(StrictSchema):
    session_storage: Literal["guest_ephemeral"] = "guest_ephemeral"
    audio_saved_by_default: Literal[False] = False
    cloud_sync_enabled: Literal[False] = False
    real_ai_enabled: Literal[False] = False
    rag_enabled: Literal[False] = False
    retention_note: str


class PrivacyEventResult(StrictSchema):
    accepted: bool
    event_type: str
    category: str
    received_at: datetime
    persisted: Literal[False] = False
    note: str
