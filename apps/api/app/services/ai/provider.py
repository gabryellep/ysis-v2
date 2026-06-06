from __future__ import annotations

import json
from urllib import request as urlrequest
from abc import ABC, abstractmethod

from app.core.config import Settings
from app.schemas.common import NOT_INFORMED
from app.schemas.relatos import OrganizarRelatoRequest, OrganizarRelatoResult
from app.services.ai.mock_provider import organize_report_mock
from app.services.ai.prompts import RELATO_ORGANIZATION_PROMPT_VERSION, RELATO_ORGANIZATION_SYSTEM_PROMPT
from app.services.ai.schema_validation import LLMRelatoOrganization, llm_output_to_result, relato_json_schema


class AIProvider(ABC):
    name: str
    mode: str
    model_version: str

    @abstractmethod
    def organize_relato(self, request: OrganizarRelatoRequest) -> OrganizarRelatoResult:
        raise NotImplementedError


class MockAIProvider(AIProvider):
    name = "mock"
    mode = "mock"
    model_version = "ysis-mock-provider.phase7b"

    def organize_relato(self, request: OrganizarRelatoRequest) -> OrganizarRelatoResult:
        result = organize_report_mock(request)
        return result.model_copy(
            update={
                "provider": "mock",
                "provider_mode": "mock",
                "attempted_provider": "mock",
                "diagnostic_notice": "Rascunho revisavel, sem avaliacao clinica, recomendacao de cuidado ou conclusao sensivel.",
            }
        )


class OpenAITextProvider(AIProvider):
    name = "openai"
    mode = "real"

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self.model_version = settings.ai_model

    def organize_relato(self, request: OrganizarRelatoRequest) -> OrganizarRelatoResult:
        from openai import OpenAI

        client = OpenAI(api_key=self._settings.openai_api_key)
        response = client.chat.completions.create(
            model=self._settings.ai_model,
            store=False,
            temperature=0.2,
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "ysis_relato_organization",
                    "schema": relato_json_schema(),
                    "strict": False,
                },
            },
            messages=[
                {"role": "system", "content": RELATO_ORGANIZATION_SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": _build_user_prompt(request),
                },
            ],
        )
        content = response.choices[0].message.content or "{}"
        parsed = LLMRelatoOrganization.model_validate(json.loads(content))
        return llm_output_to_result(request, parsed, provider="openai", provider_mode="real")


class LocalLLMProvider(AIProvider):
    name = "local"
    mode = "local"

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self.model_version = settings.local_llm_model

    def organize_relato(self, request: OrganizarRelatoRequest) -> OrganizarRelatoResult:
        payload = {
            "model": self._settings.local_llm_model,
            "stream": False,
            "format": relato_json_schema(),
            "system": RELATO_ORGANIZATION_SYSTEM_PROMPT,
            "prompt": _build_user_prompt(request),
            "options": {
                "temperature": 0.2,
            },
        }
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        http_request = urlrequest.Request(
            f"{self._settings.local_llm_url.rstrip('/')}/api/generate",
            data=body,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urlrequest.urlopen(http_request, timeout=45) as response:
            raw = json.loads(response.read().decode("utf-8"))

        content = raw.get("response") or "{}"
        parsed = LLMRelatoOrganization.model_validate(json.loads(content))
        return llm_output_to_result(request, parsed, provider="local", provider_mode="local")


def _build_user_prompt(request: OrganizarRelatoRequest) -> str:
    return json.dumps(
        {
            "task": "organizar_relato_revisavel",
            "language": request.original.language,
            "input_mode": request.original.input_mode,
            "discreet_mode": request.client_context.discreet_mode,
            "known_context": request.known_context or NOT_INFORMED,
            "relato_text": request.original.text,
            "required_notice": "Nao diagnosticar, nao prescrever, nao concluir fatos sensiveis. Marcar ausencias como nao informado.",
            "prompt_version": RELATO_ORGANIZATION_PROMPT_VERSION,
        },
        ensure_ascii=False,
    )


def get_ai_provider(settings: Settings) -> AIProvider:
    if settings.ai_real_configured:
        return OpenAITextProvider(settings)
    if settings.ai_provider == "local":
        return LocalLLMProvider(settings)
    return MockAIProvider()
