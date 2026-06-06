from __future__ import annotations

from fastapi import Header

from app.db.supabase import SupabaseClientError, SupabaseUnavailableError, get_supabase_auth_client
from app.schemas.session import CurrentUser


def get_optional_current_user(authorization: str | None = Header(default=None)) -> CurrentUser | None:
    if not authorization:
        return None
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return None

    try:
        user = get_supabase_auth_client().get_user(token)
    except (SupabaseUnavailableError, SupabaseClientError):
        return None

    subject = user.get("id") if user else None
    if not isinstance(subject, str) or not subject:
        return None

    email = user.get("email")
    role = user.get("role")
    return CurrentUser(
        id=subject,
        email=email if isinstance(email, str) else None,
        role=role if isinstance(role, str) else None,
    )
