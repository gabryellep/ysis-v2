from __future__ import annotations

from app.schemas.common import NOT_INFORMED, REVIEW_NOTICE, ReportPurpose
from app.schemas.relatorios import (
    GerarRelatorioRequest,
    GerarRelatorioResult,
    ReportSection,
    ReportSectionItem,
    StructuredReport,
    SuggestedQuestion,
)
from app.services.security.safety import default_safety_warnings, sanitize_safety_language


PURPOSE_TITLES = {
    ReportPurpose.CONSULTATION: "Relatorio para consulta",
    ReportPurpose.SYMPTOMS: "Relatorio para organizar sintomas",
    ReportPurpose.CONVERSATION: "Roteiro para conversa de cuidado",
    ReportPurpose.PERSONAL: "Registro pessoal revisavel",
    ReportPurpose.GYNECOLOGIST: "Relatorio para ginecologia",
    ReportPurpose.PSYCHOLOGIST: "Relatorio para psicologia",
    ReportPurpose.OBSTETRICS: "Relatorio para obstetricia",
    ReportPurpose.URGENT_CARE: "Relatorio para atendimento de urgencia",
    ReportPurpose.SENSITIVE_SITUATION: "Relatorio para situacao sensivel",
}


def generate_demo_report(request: GerarRelatorioRequest) -> GerarRelatorioResult:
    base_text = request.revised.complete if request.revised else request.original.text
    safe_text = sanitize_safety_language(base_text.strip()) or NOT_INFORMED
    report_date = request.report_date.isoformat() if request.report_date else NOT_INFORMED

    sections = [
        ReportSection(
            id="relato-atual",
            title="Relato atual",
            items=[
                ReportSectionItem(label="Texto revisado", value=safe_text, sensitive=True),
                ReportSectionItem(label="Data informada", value=report_date),
                ReportSectionItem(label="Finalidade", value=request.purpose.value),
            ],
        ),
        ReportSection(
            id="campos-a-revisar",
            title="Campos a revisar",
            items=[
                ReportSectionItem(label="Duracao", value=NOT_INFORMED),
                ReportSectionItem(label="Intensidade", value=NOT_INFORMED),
                ReportSectionItem(label="Relacao com ciclo", value=NOT_INFORMED),
            ],
        ),
        ReportSection(
            id="limites",
            title="Limites do relatorio",
            items=[ReportSectionItem(label="Aviso", value=REVIEW_NOTICE)],
        ),
    ]

    questions = [
        SuggestedQuestion(
            category="consulta",
            text="Quais informacoes adicionais podem ajudar na avaliacao profissional?",
            why_it_may_help="Ajuda a completar lacunas sem transformar o relato em conclusao.",
        ),
        SuggestedQuestion(
            category="observacao",
            text="Quais sinais ou mudancas devo observar ate a conversa?",
            why_it_may_help="Ajuda a manter acompanhamento seguro e revisavel.",
        ),
        SuggestedQuestion(
            category="seguranca",
            text="Em quais situacoes devo buscar apoio com mais urgencia?",
            why_it_may_help="Ajuda a combinar criterios de seguranca com profissional.",
        ),
    ]

    report = StructuredReport(
        title=PURPOSE_TITLES.get(request.purpose, "Relatorio Ysis"),
        purpose=request.purpose,
        period=report_date,
        source_record_ids=request.source_record_ids,
        summary=safe_text,
        sections=sections,
        suggested_questions=questions,
        safety_warnings=default_safety_warnings(),
        missing_fields={
            "duracao": NOT_INFORMED,
            "intensidade": NOT_INFORMED,
            "relacao_com_ciclo": NOT_INFORMED,
        },
        share_text=f"{PURPOSE_TITLES.get(request.purpose, 'Relatorio Ysis')}\n\n{safe_text}\n\n{REVIEW_NOTICE}",
    )
    return GerarRelatorioResult(report=report)
