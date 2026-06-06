from datetime import datetime

from fastapi.testclient import TestClient

from app.core.config import Settings, get_settings
from app.main import app
from app.services.ai.provider import get_ai_provider


def _payload(scopes: list[str] | None = None) -> dict:
    return {
        "action_id": "phase7b-test",
        "consent": {
            "granted": True,
            "text_version": "ai-processing-phase7b-v1",
            "granted_at": datetime.utcnow().isoformat(),
            "scopes": scopes or ["ai_processing", "temporary_processing", "review_required"],
        },
        "client_context": {
            "mode": "guest",
            "discreet_mode": False,
            "source_screen": "ferramenta",
        },
        "original": {
            "text": "Senti dor abdominal ontem e quero organizar o que contar na consulta.",
            "input_mode": "written",
            "language": "pt-BR",
        },
    }


def test_organizar_relato_requires_ai_processing_consent() -> None:
    with TestClient(app) as client:
        response = client.post("/relatos/organizar", json=_payload(scopes=["temporary_processing"]))

    assert response.status_code == 403


def test_organizar_relato_uses_safe_mock_without_persistence() -> None:
    app.dependency_overrides[get_settings] = lambda: Settings(AI_PROVIDER="mock", OPENAI_API_KEY=None)
    try:
        with TestClient(app) as client:
            response = client.post("/relatos/organizar", json=_payload())
    finally:
        app.dependency_overrides.clear()

    body = response.json()
    result = body["result"]

    assert response.status_code == 200
    assert body["ok"] is True
    assert result["provider"] == "mock"
    assert result["provider_mode"] == "mock"
    assert result["persisted"] is False
    assert result["review_required"] is True
    assert result["revised"]["medium"]


def test_organizar_relato_blocks_forbidden_language_input() -> None:
    payload = _payload()
    payload["original"]["text"] = "Voce tem diagnostico provavel e tome remedio."

    with TestClient(app) as client:
        response = client.post("/relatos/organizar", json=payload)

    body = response.json()

    assert response.status_code == 200
    assert body["ok"] is False
    assert body["safety"]["fallback_used"] is True
    assert body["safety"]["blocked_terms_found"]


def test_ai_provider_selects_openai_when_configured() -> None:
    settings = Settings(AI_PROVIDER="openai", OPENAI_API_KEY="sk-test-placeholder")
    provider = get_ai_provider(settings)

    assert provider.name == "openai"
    assert provider.mode == "real"


def test_ai_provider_selects_local_when_configured() -> None:
    settings = Settings(AI_PROVIDER="local", OPENAI_API_KEY=None)
    provider = get_ai_provider(settings)

    assert provider.name == "local"
    assert provider.mode == "local"
