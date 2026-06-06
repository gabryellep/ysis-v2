from __future__ import annotations

from datetime import datetime, timedelta
from hashlib import sha256
import secrets

from app.core.config import Settings, get_settings
from app.db.supabase import SupabaseClientError, SupabaseUnavailableError, get_supabase_backend_client
from app.schemas.session import CurrentUser, SessionStartInput, SessionState


def _hash_session_id(session_id: str) -> str:
    return sha256(session_id.encode("utf-8")).hexdigest()


def start_session(
    payload: SessionStartInput,
    user: CurrentUser | None = None,
    settings: Settings | None = None,
) -> SessionState:
    resolved_settings = settings or get_settings()
    session_id = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(minutes=resolved_settings.guest_session_ttl_minutes)
    authenticated = user is not None
    mode = "account" if authenticated and payload.mode == "account" else payload.mode
    should_persist_metadata = authenticated and payload.persist_metadata
    metadata_persisted = False

    if should_persist_metadata:
        try:
            client = get_supabase_backend_client()
            client.table_insert(
                "guest_sessions",
                {
                    "user_id": user.id if user else None,
                    "session_hash": _hash_session_id(session_id),
                    "purpose": payload.purpose,
                    "expires_at": expires_at.isoformat(),
                },
            )
            metadata_persisted = True
        except (SupabaseUnavailableError, SupabaseClientError):
            metadata_persisted = False

    return SessionState(
        session_id=session_id,
        mode=mode,
        authenticated=authenticated,
        user_id=user.id if user else None,
        purpose=payload.purpose,
        expires_at=expires_at,
        metadata_persisted=metadata_persisted,
        retention_note=(
            "Relato e audio nao sao salvos por padrao. "
            "Sessao convidada usa identificador temporario; apenas metadados nao sensiveis podem ser persistidos quando seguro."
        ),
    )
