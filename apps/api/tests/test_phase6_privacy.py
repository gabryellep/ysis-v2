from datetime import datetime

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client() -> TestClient:
    with TestClient(app) as test_client:
        yield test_client


def test_health_still_works(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_guest_session_does_not_persist_sensitive_data(client: TestClient) -> None:
    response = client.post(
        "/sessoes/iniciar",
        json={"mode": "guest", "purpose": "ferramenta", "persist_metadata": False},
    )

    body = response.json()["result"]
    assert response.status_code == 200
    assert body["mode"] == "guest"
    assert body["authenticated"] is False
    assert body["sensitive_persistence"] is False
    assert body["metadata_persisted"] is False
    assert body["session_id"]


def test_guest_consent_validates_without_persistence(client: TestClient) -> None:
    response = client.post(
        "/privacidade/consentimentos",
        json={
            "consent": {
                "granted": True,
                "text_version": "privacy-v1",
                "granted_at": datetime.utcnow().isoformat(),
                "scopes": ["tool_processing"],
            },
            "consent_type": "tool_processing",
            "decision": "granted",
            "source": "ferramenta",
        },
    )

    body = response.json()["result"]
    assert response.status_code == 200
    assert body["accepted"] is True
    assert body["persisted"] is False


def test_guest_privacy_event_avoids_sensitive_payload(client: TestClient) -> None:
    response = client.post(
        "/privacidade/eventos",
        json={
            "event_type": "guest_session_started",
            "category": "guest_session",
            "source": "ferramenta",
        },
    )

    body = response.json()["result"]
    assert response.status_code == 200
    assert body["accepted"] is True
    assert body["persisted"] is False
