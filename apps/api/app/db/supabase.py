from __future__ import annotations

from typing import Any
from urllib import error, request
import json

from app.core.config import Settings, get_settings


class SupabaseUnavailableError(RuntimeError):
    """Raised when Supabase is not configured for this environment."""


class SupabaseClientError(RuntimeError):
    """Raised when Supabase returns an unexpected error."""


class SupabaseBackendClient:
    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()
        if not self.settings.supabase_configured:
            raise SupabaseUnavailableError("Supabase backend client is not configured.")
        self.base_url = self.settings.supabase_url.rstrip("/")
        self.service_role_key = self.settings.supabase_service_role_key or ""
        self.anon_key = self.settings.supabase_anon_key or ""

    @classmethod
    def for_auth(cls, settings: Settings | None = None) -> "SupabaseBackendClient":
        resolved_settings = settings or get_settings()
        if not resolved_settings.supabase_auth_configured:
            raise SupabaseUnavailableError("Supabase auth client is not configured.")
        client = cls.__new__(cls)
        client.settings = resolved_settings
        client.base_url = resolved_settings.supabase_url.rstrip("/") if resolved_settings.supabase_url else ""
        client.service_role_key = resolved_settings.supabase_service_role_key or ""
        client.anon_key = resolved_settings.supabase_anon_key or ""
        return client

    def get_user(self, jwt: str) -> dict[str, Any] | None:
        response = self._request(
            method="GET",
            path="/auth/v1/user",
            auth_token=jwt,
            api_key=self.anon_key,
        )
        return response if isinstance(response, dict) else None

    def table_insert(self, table: str, payload: dict[str, Any]) -> dict[str, Any] | None:
        response = self._request(
            method="POST",
            path=f"/rest/v1/{table}",
            payload=payload,
            prefer="return=representation",
        )
        if isinstance(response, list):
            return response[0] if response else None
        if isinstance(response, dict):
            return response
        return None

    def _request(
        self,
        *,
        method: str,
        path: str,
        payload: dict[str, Any] | None = None,
        prefer: str | None = None,
        auth_token: str | None = None,
        api_key: str | None = None,
    ) -> Any:
        body = json.dumps(payload or {}).encode("utf-8") if payload is not None else None
        headers = {
            "apikey": api_key or self.service_role_key,
            "authorization": f"Bearer {auth_token or self.service_role_key}",
            "content-type": "application/json",
        }
        if prefer:
            headers["prefer"] = prefer

        req = request.Request(
            url=f"{self.base_url}{path}",
            data=body,
            headers=headers,
            method=method,
        )
        try:
            with request.urlopen(req, timeout=8) as response:
                raw = response.read().decode("utf-8")
        except error.HTTPError as exc:
            detail = exc.read().decode("utf-8")
            raise SupabaseClientError(f"Supabase request failed: {exc.code} {detail}") from exc
        except error.URLError as exc:
            raise SupabaseClientError(f"Supabase request failed: {exc.reason}") from exc

        if not raw:
            return None
        return json.loads(raw)


def get_supabase_backend_client() -> SupabaseBackendClient:
    return SupabaseBackendClient()


def get_supabase_auth_client() -> SupabaseBackendClient:
    return SupabaseBackendClient.for_auth()
