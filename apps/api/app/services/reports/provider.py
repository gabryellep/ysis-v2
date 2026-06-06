from __future__ import annotations

import json
from abc import ABC, abstractmethod
from urllib import request as urlrequest

from app.core.config import Settings
from app.schemas.relatorios import GerarRelatorioRequest, GerarRelatorioResult, StructuredReport
from app.services.reports.builder import build_structured_report, get_template

REPORT_GENERATION_PROMPT_VERSION = "ysis-report-purpose-builders.phase8"


class ReportProvider(ABC):
    name: str
    mode: str
    model_version: str

    @abstractmethod
    def generate_report(self, request: GerarRelatorioRequest) -> GerarRelatorioResult:
        raise NotImplementedError


class MockReportProvider(ReportProvider):
    name = "mock"
    mode = "mock"
    model_version = "ysis-report-mock.phase8"

    def generate_report(self, request: GerarRelatorioRequest) -> GerarRelatorioResult:
        return build_structured_report(request, provider="mock", provider_mode="mock")


class OpenAIReportProvider(ReportProvider):
    name = "openai"
    mode = "real"

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self.model_version = settings.ai_model

    def generate_report(self, request: GerarRelatorioRequest) -> GerarRelatorioResult:
        from openai import OpenAI

        client = OpenAI(api_key=self._settings.openai_api_key)
        response = client.chat.completions.create(
            model=self._settings.ai_model,
            store=False,
            temperature=0.15,
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "ysis_structured_report",
                    "schema": StructuredReport.model_json_schema(),
                    "strict": False,
                },
            },
            messages=[
                {"role": "system", "content": _system_prompt()},
                {"role": "user", "content": _user_prompt(request)},
            ],
        )
        content = response.choices[0].message.content or "{}"
        report = StructuredReport.model_validate(json.loads(content))
        report.provider = "openai"
        report.provider_mode = "real"
        report.persisted = False
        report.review_required = True
        return GerarRelatorioResult(report=report)


class LocalReportProvider(ReportProvider):
    name = "local"
    mode = "local"

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self.model_version = settings.local_llm_model

    def generate_report(self, request: GerarRelatorioRequest) -> GerarRelatorioResult:
        payload = {
            "model": self._settings.local_llm_model,
            "stream": False,
            "format": StructuredReport.model_json_schema(),
            "system": _system_prompt(),
            "prompt": _user_prompt(request),
            "options": {"temperature": 0.15},
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

        report = StructuredReport.model_validate(json.loads(raw.get("response") or "{}"))
        report.provider = "local"
        report.provider_mode = "local"
        report.persisted = False
        report.review_required = True
        return GerarRelatorioResult(report=report)


def get_report_provider(settings: Settings) -> ReportProvider:
    if settings.ai_real_configured:
        return OpenAIReportProvider(settings)
    if settings.ai_provider == "local":
        return LocalReportProvider(settings)
    return MockReportProvider()


def _system_prompt() -> str:
    return (
        "Voce gera relatorios estruturados da Ysis em pt-BR. "
        "Nunca diagnostique, nunca prescreva, nunca diga que algo e normal, "
        "nunca conclua violencia, abuso, culpa ou intencao. "
        "Use apenas informacoes relatadas. Quando faltar dado, escreva 'nao informado'. "
        "A saida deve ser JSON valido no schema fornecido."
    )


def _user_prompt(request: GerarRelatorioRequest) -> str:
    template = get_template(request.purpose)
    return json.dumps(
        {
            "task": "gerar_relatorio_por_finalidade",
            "purpose": request.purpose.value,
            "required_structure": {
                "title": template.title,
                "report_type": template.report_type,
                "audience": template.audience,
                "tone": template.tone,
                "fallback_message": template.fallback_message,
            },
            "original": request.original.model_dump(mode="json"),
            "revised": request.revised.model_dump(mode="json") if request.revised else None,
            "report_date": request.report_date.isoformat() if request.report_date else None,
            "source_record_ids": request.source_record_ids,
            "guardrails": [
                "Nao diagnosticar.",
                "Nao prescrever.",
                "Nao inventar informacao.",
                "Nao concluir situacao sensivel.",
                "Usar 'voce relatou', 'pode ser util conversar com uma profissional' e 'nao informado'.",
            ],
            "prompt_version": REPORT_GENERATION_PROMPT_VERSION,
        },
        ensure_ascii=False,
    )
