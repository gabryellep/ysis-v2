from datetime import datetime
from typing import Literal

from pydantic import Field

from app.schemas.common import StrictSchema


class SessionStartInput(StrictSchema):
    mode: Literal["guest", "account", "temporary"] = "guest"
    purpose: Literal["ferramenta", "privacy_control"] = "ferramenta"
    persist_metadata: bool = False
    source: str = Field(default="ferramenta", min_length=1, max_length=80)


class SessionState(StrictSchema):
    session_id: str
    mode: Literal["guest", "account", "temporary"]
    authenticated: bool
    user_id: str | None = None
    purpose: str
    expires_at: datetime
    sensitive_persistence: Literal[False] = False
    metadata_persisted: bool = False
    retention_note: str


class CurrentUser(StrictSchema):
    id: str
    email: str | None = None
    role: str | None = None
