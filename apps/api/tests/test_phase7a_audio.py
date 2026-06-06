from fastapi.testclient import TestClient

from app.core.config import Settings
from app.main import app
from app.schemas.audio import AudioConsentEvidence
from app.services.transcription.provider import MockTranscriptionProvider, TemporaryAudio, get_transcription_provider


def test_audio_transcription_requires_consent() -> None:
    with TestClient(app) as client:
        response = client.post(
            "/audio/transcrever",
            data={"audio_consent_granted": "false", "consent_text_version": "audio-test-v1"},
            files={"audio": ("relato.webm", b"fake-audio", "audio/webm")},
        )

    assert response.status_code == 403


def test_audio_transcription_rejects_unsupported_type() -> None:
    with TestClient(app) as client:
        response = client.post(
            "/audio/transcrever",
            data={"audio_consent_granted": "true", "consent_text_version": "audio-test-v1"},
            files={"audio": ("relato.txt", b"not-audio", "text/plain")},
        )

    assert response.status_code == 415


def test_audio_transcription_uses_safe_mock_without_persistence() -> None:
    with TestClient(app) as client:
        response = client.post(
            "/audio/transcrever",
            data={"audio_consent_granted": "true", "consent_text_version": "audio-test-v1"},
            files={"audio": ("relato.webm", b"fake-audio", "audio/webm")},
        )

    body = response.json()
    result = body["result"]

    assert response.status_code == 200
    assert body["ok"] is True
    assert result["provider"] == "mock"
    assert result["provider_mode"] == "mock"
    assert result["audio_saved"] is False
    assert result["persisted"] is False
    assert result["review_required"] is True
    assert result["transcript"]


def test_transcription_provider_selects_openai_when_configured() -> None:
    settings = Settings(TRANSCRIPTION_PROVIDER="openai", OPENAI_API_KEY="sk-test-placeholder")
    provider = get_transcription_provider(settings)

    assert provider.name == "openai"
    assert provider.mode == "real"


def test_mock_fallback_can_report_attempted_provider() -> None:
    consent = AudioConsentEvidence(granted=True, text_version="audio-test-v1")
    result = MockTranscriptionProvider().transcribe(
        audio=TemporaryAudio(filename="a.webm", content_type="audio/webm", data=b"x"),
        consent=consent,
    )
    result = result.model_copy(update={"attempted_provider": "openai", "fallback_reason": "APIConnectionError"})

    assert result.provider == "mock"
    assert result.attempted_provider == "openai"
    assert result.fallback_reason == "APIConnectionError"
