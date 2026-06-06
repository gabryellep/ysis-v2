from datetime import datetime

from fastapi.testclient import TestClient

from app.core.config import Settings, get_settings
from app.main import app


def _payload(purpose: str = "gynecologist", text: str | None = None, scopes: list[str] | None = None) -> dict:
    relato = text or "Senti dor forte ontem, apareceu depois da menstruacao e fiquei com medo."
    return {
        "action_id": f"phase8-{purpose}",
        "consent": {
            "granted": True,
            "text_version": "report-generation-phase8-v1",
            "granted_at": datetime.utcnow().isoformat(),
            "scopes": scopes or ["ai_processing", "temporary_processing", "no_persistence", "review_required"],
        },
        "client_context": {
            "mode": "guest",
            "discreet_mode": False,
            "source_screen": "ferramenta",
        },
        "purpose": purpose,
        "original": {
            "text": relato,
            "input_mode": "written",
            "language": "pt-BR",
        },
        "revised": {
            "short": relato,
            "medium": relato,
            "complete": relato,
            "user_can_edit": True,
        },
        "report_date": "2026-06-06",
        "source_record_ids": [],
    }


def test_gerar_relatorio_requires_ai_processing_consent() -> None:
    with TestClient(app) as client:
        response = client.post("/relatorios/gerar", json=_payload(scopes=["temporary_processing"]))

    assert response.status_code == 403


def test_gerar_relatorio_has_distinct_structures_for_phase8_purposes() -> None:
    app.dependency_overrides[get_settings] = lambda: Settings(AI_PROVIDER="mock", OPENAI_API_KEY=None)
    purposes = ["gynecologist", "psychologist", "obstetrics", "personal", "sensitive_situation"]
    try:
        with TestClient(app) as client:
            reports = [client.post("/relatorios/gerar", json=_payload(purpose)).json()["result"]["report"] for purpose in purposes]
    finally:
        app.dependency_overrides.clear()

    section_sets = {tuple(section["id"] for section in report["sections"]) for report in reports}
    report_types = {report["report_type"] for report in reports}

    assert len(section_sets) == len(purposes)
    assert report_types == {"ginecologia", "psicologia", "obstetricia", "registro_pessoal", "situacao_sensivel"}
    assert all(report["persisted"] is False for report in reports)
    assert all(report["review_required"] is True for report in reports)
    assert all(report["provider"] == "mock" for report in reports)


def test_gerar_relatorio_blocks_sensitive_conclusive_language() -> None:
    payload = _payload(
        "sensitive_situation",
        text="Isso foi abuso e foi violencia, preciso organizar sem diagnostico.",
    )

    with TestClient(app) as client:
        response = client.post("/relatorios/gerar", json=payload)

    body = response.json()

    assert response.status_code == 200
    assert body["ok"] is False
    assert body["safety"]["fallback_used"] is True
    assert "foi abuso" in body["safety"]["blocked_terms_found"]
