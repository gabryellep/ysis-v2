from __future__ import annotations

from datetime import datetime

from app.db.supabase import SupabaseClientError, SupabaseUnavailableError, get_supabase_backend_client
from app.schemas.privacy import PrivacyEventInput, PrivacyEventResult
from app.schemas.session import CurrentUser


def register_privacy_event(payload: PrivacyEventInput, user: CurrentUser | None = None) -> PrivacyEventResult:
    persisted = False
    persistence_reason = "Evento auditado no backend sem persistencia por estar em modo convidada."

    if user:
        try:
            get_supabase_backend_client().table_insert(
                "privacy_events",
                {
                    "user_id": user.id,
                    "event_type": payload.event_type,
                    "category": _database_category(payload.category),
                    "source": payload.source,
                    "payload": {
                        "source": payload.source,
                        "contains_sensitive_content": False,
                    },
                },
            )
            persisted = True
            persistence_reason = "Evento de privacidade persistido sem conteudo intimo."
        except (SupabaseUnavailableError, SupabaseClientError):
            persistence_reason = "Supabase indisponivel ou nao configurado; evento validado sem persistencia."

    return PrivacyEventResult(
        accepted=True,
        event_type=payload.event_type,
        category=payload.category,
        received_at=datetime.utcnow(),
        persisted=persisted,
        note=persistence_reason,
    )


def _database_category(category: str) -> str:
    if category == "all_local_data":
        return "all_cloud_data"
    return category
