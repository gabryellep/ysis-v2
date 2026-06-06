from __future__ import annotations

from datetime import datetime
from typing import Any

from app.db.supabase import SupabaseClientError, SupabaseUnavailableError, get_supabase_backend_client
from app.schemas.privacy import ConsentLogInput, ConsentLogResult
from app.schemas.session import CurrentUser


def register_consent(payload: ConsentLogInput, user: CurrentUser | None = None) -> ConsentLogResult:
    persisted = False
    persistence_reason = "Modo convidada: consentimento validado sem persistir dados pessoais."

    if user:
        try:
            client = get_supabase_backend_client()
            client.table_insert(
                "consent_logs",
                {
                    "user_id": user.id,
                    "consent_type": payload.consent_type,
                    "decision": payload.decision,
                    "scope": ",".join(payload.consent.scopes) or payload.consent_type,
                    "source": payload.source,
                    "text_version": payload.consent.text_version,
                    "payload": _safe_consent_payload(payload),
                },
            )
            event_type = _event_type_for_decision(payload.decision)
            if event_type:
                client.table_insert(
                    "privacy_events",
                    {
                        "user_id": user.id,
                        "event_type": event_type,
                        "category": "consent_logs",
                        "source": payload.source,
                        "payload": {
                            "consent_type": payload.consent_type,
                            "text_version": payload.consent.text_version,
                            "contains_sensitive_content": False,
                        },
                    },
                )
            persisted = True
            persistence_reason = "Consentimento persistido via backend com service role e evento auditavel sem conteudo intimo."
        except (SupabaseUnavailableError, SupabaseClientError):
            persistence_reason = "Supabase indisponivel ou nao configurado; consentimento validado sem persistencia."

    return ConsentLogResult(
        accepted=payload.decision == "granted",
        consent_type=payload.consent_type,
        decision=payload.decision,
        received_at=datetime.utcnow(),
        persisted=persisted,
        note=persistence_reason,
    )


def _safe_consent_payload(payload: ConsentLogInput) -> dict[str, Any]:
    return {
        "granted": payload.consent.granted,
        "granted_at": payload.consent.granted_at.isoformat(),
        "scopes": payload.consent.scopes,
        "source": payload.source,
    }


def _event_type_for_decision(decision: str) -> str | None:
    if decision == "granted":
        return "consent_granted"
    if decision == "revoked":
        return "consent_revoked"
    return None
