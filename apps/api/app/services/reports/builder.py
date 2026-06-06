from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from typing import Callable

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


@dataclass(frozen=True)
class PurposeTemplate:
    title: str
    report_type: str
    audience: str
    tone: str
    fallback_message: str
    sections: Callable[[str, str], list[ReportSection]]
    questions: list[SuggestedQuestion]


def build_structured_report(
    request: GerarRelatorioRequest,
    *,
    provider: str = "mock",
    provider_mode: str = "mock",
) -> GerarRelatorioResult:
    base_text = request.revised.complete if request.revised else request.original.text
    safe_text = sanitize_safety_language(base_text.strip()) or NOT_INFORMED
    report_date = _format_date(request.report_date or request.original.reported_on)
    template = get_template(request.purpose)

    missing_fields = _missing_fields(template.sections(safe_text, report_date))
    report = StructuredReport(
        title=template.title,
        purpose=request.purpose,
        report_type=template.report_type,  # type: ignore[arg-type]
        audience=template.audience,
        tone=template.tone,
        period=report_date,
        source_record_ids=request.source_record_ids,
        summary=_summary_for(request.purpose, safe_text),
        sections=template.sections(safe_text, report_date),
        suggested_questions=template.questions,
        non_diagnostic_notice=REVIEW_NOTICE,
        fallback_message=template.fallback_message,
        safety_warnings=default_safety_warnings(),
        missing_fields=missing_fields,
        share_text="",
        provider=provider,  # type: ignore[arg-type]
        provider_mode=provider_mode,  # type: ignore[arg-type]
    )
    report.share_text = _format_share_text(report)
    return GerarRelatorioResult(report=report)


def get_template(purpose: ReportPurpose) -> PurposeTemplate:
    templates = {
        ReportPurpose.GYNECOLOGIST: PurposeTemplate(
            title="Relatorio para consulta ginecologica",
            report_type="ginecologia",
            audience="ginecologista",
            tone="objetivo, clinico e revisavel, sem diagnostico",
            fallback_message="Quando inicio, frequencia, intensidade ou relacao com ciclo nao forem citados, mantenha como nao informado.",
            sections=_gynecologist_sections,
            questions=[
                _q("consulta", "O que pode ser util avaliar em consulta a partir do que voce relatou?", "Ajuda a abrir a conversa sem transformar relato em conclusao."),
                _q("observacao", "Quais sinais devo acompanhar ate a consulta?", "Ajuda a observar mudancas de forma segura."),
                _q("contexto", "A relacao com ciclo, relacao sexual, uso de medicamento ou rotina pode ser relevante?", "Ajuda a completar contexto quando fizer sentido."),
            ],
        ),
        ReportPurpose.PSYCHOLOGIST: PurposeTemplate(
            title="Relatorio para conversa com psicologa",
            report_type="psicologia",
            audience="psicologa",
            tone="acolhedor, emocional e cuidadoso, sem interpretar causas",
            fallback_message="Quando sentimentos, medos, vergonha ou bloqueios nao forem citados, registre como nao informado.",
            sections=_psychologist_sections,
            questions=[
                _q("emocional", "Como posso comecar a falar disso sem precisar contar tudo de uma vez?", "Ajuda a criar uma abertura possivel para a conversa."),
                _q("limites", "Quais assuntos eu prefiro abordar com mais cuidado ou deixar para depois?", "Ajuda a preservar limites durante o atendimento."),
                _q("rotina", "De que forma isso tem afetado meu sono, rotina, corpo ou relacoes?", "Ajuda a observar impacto sem concluir causa."),
            ],
        ),
        ReportPurpose.OBSTETRICS: PurposeTemplate(
            title="Relatorio para avaliacao obstetrica",
            report_type="obstetricia",
            audience="obstetricia",
            tone="prudente, factual e orientado a avaliacao profissional",
            fallback_message="Se semana gestacional, sinais, intensidade ou datas nao forem citados, mantenha como nao informado.",
            sections=_obstetrics_sections,
            questions=[
                _q("gestacao", "O que do meu contexto gestacional pode ser importante mencionar?", "Ajuda a situar o relato sem presumir informacao."),
                _q("consulta", "Quais sinais relatados merecem avaliacao presencial ou orientacao profissional?", "Ajuda a conversar sobre seguranca com profissional."),
                _q("observacao", "O que devo acompanhar e registrar ate receber orientacao?", "Ajuda a manter um registro revisavel."),
            ],
        ),
        ReportPurpose.PERSONAL: PurposeTemplate(
            title="Registro pessoal revisavel",
            report_type="registro_pessoal",
            audience="uso pessoal",
            tone="intimo, organizado e simples, sem conclusoes clinicas",
            fallback_message="Se data, evolucao ou pontos de acompanhamento nao forem citados, mantenha como nao informado.",
            sections=_personal_sections,
            questions=[
                _q("registro", "O que mudou desde que percebi essa situacao?", "Ajuda a acompanhar evolucao percebida."),
                _q("observacao", "O que quero observar nos proximos dias, se fizer sentido?", "Ajuda a criar acompanhamento sem prescrever conduta."),
                _q("contexto", "Houve algo no contexto que eu queira lembrar depois?", "Ajuda a preservar detalhes uteis para revisao."),
            ],
        ),
        ReportPurpose.SENSITIVE_SITUATION: PurposeTemplate(
            title="Registro neutro de situacao sensivel",
            report_type="situacao_sensivel",
            audience="uso pessoal ou conversa de apoio",
            tone="neutro, cuidadoso e nao conclusivo",
            fallback_message="Nunca conclua violencia, abuso, culpa ou intencao. Separe partes lembradas, incertas, sentimentos e apoio desejado.",
            sections=_sensitive_sections,
            questions=[
                _q("limites", "Que partes eu consigo ou quero contar agora?", "Ajuda a preservar autonomia e limites."),
                _q("seguranca", "Que apoio eu gostaria de buscar para nao ficar sozinha com isso?", "Ajuda a nomear apoio desejado sem concluir fatos."),
                _q("registro", "Quais partes eu lembro e quais ainda parecem incertas?", "Ajuda a separar memoria, duvida e sentimento."),
            ],
        ),
    }
    return templates.get(purpose, templates[ReportPurpose.PERSONAL])


def _gynecologist_sections(text: str, report_date: str) -> list[ReportSection]:
    return [
        _section("sintomas-fisicos", "Sintomas fisicos relatados", [("Voce relatou", text, True)]),
        _section("padrao", "Inicio, frequencia e intensidade", [("Inicio", _find_context(text, ["desde", "comecou", "inicio"]), False), ("Frequencia", _find_context(text, ["frequente", "vezes", "todo dia", "semana"]), False), ("Intensidade", _find_context(text, ["leve", "moderada", "intensa", "forte"]), False)]),
        _section("ciclo", "Ciclo e contexto corporal", [("Relacao com ciclo", _find_context(text, ["ciclo", "menstruacao", "periodo menstrual"]), False), ("Data do registro", report_date, False)]),
        _section("duvidas", "Duvidas para consulta", [("Ponto principal", "Pode ser util conversar com uma profissional sobre os sinais relatados e o contexto em que aparecem.", False)]),
        _section("limites", "Aviso de seguranca", [("Aviso", REVIEW_NOTICE, False)]),
    ]


def _psychologist_sections(text: str, report_date: str) -> list[ReportSection]:
    return [
        _section("abertura", "Frase de abertura possivel", [("Frase", f"Quero falar sobre algo que venho tentando organizar: {text}", True)]),
        _section("sentimentos", "Sentimentos e impacto emocional", [("Sentimentos relatados", _find_context(text, ["medo", "vergonha", "triste", "ansiedade", "culpa", "raiva"]), True), ("Impacto emocional", text, True)]),
        _section("bloqueios", "Vergonha, medo ou bloqueios", [("Bloqueios relatados", _find_context(text, ["nao consigo", "bloqueio", "vergonha", "medo", "dificil falar"]), True)]),
        _section("rotina", "Impacto na rotina ou relacoes", [("Rotina/relacoes", _find_context(text, ["sono", "rotina", "trabalho", "relacao", "familia", "estudo"]), False), ("Data do registro", report_date, False)]),
        _section("limites", "Aviso de seguranca", [("Aviso", REVIEW_NOTICE, False)]),
    ]


def _obstetrics_sections(text: str, report_date: str) -> list[ReportSection]:
    return [
        _section("contexto-gestacional", "Contexto gestacional informado", [("Gestacao", _find_context(text, ["gestante", "gravida", "gravidez", "semanas", "trimestre"]), True), ("Data do registro", report_date, False)]),
        _section("sinais", "Sinais relatados", [("Voce relatou", text, True), ("Intensidade ou mudanca", _find_context(text, ["intensa", "forte", "piorou", "mudou", "aumentou"]), False)]),
        _section("avaliacao", "Pontos para avaliacao profissional", [("Ponto de conversa", "Pode ser util conversar com uma profissional sobre os sinais relatados, quando apareceram e se houve mudanca recente.", False)]),
        _section("duvidas", "Duvidas para obstetricia", [("Duvida central", "Quais informacoes do relato podem ajudar na avaliacao da gestacao?", False)]),
        _section("limites", "Aviso de seguranca", [("Aviso", REVIEW_NOTICE, False)]),
    ]


def _personal_sections(text: str, report_date: str) -> list[ReportSection]:
    return [
        _section("data", "Data e contexto", [("Data do registro", report_date, False), ("Contexto informado", _find_context(text, ["hoje", "ontem", "semana", "mes", "depois"]), False)]),
        _section("relato-organizado", "Relato organizado", [("Voce relatou", text, True)]),
        _section("evolucao", "Evolucao percebida", [("Mudancas percebidas", _find_context(text, ["mudou", "melhorou", "piorou", "continua", "voltou"]), False)]),
        _section("acompanhar", "Pontos para acompanhar", [("Ponto de acompanhamento", "Observe apenas o que fizer sentido para voce e revise este registro quando quiser.", False)]),
        _section("limites", "Aviso de seguranca", [("Aviso", REVIEW_NOTICE, False)]),
    ]


def _sensitive_sections(text: str, report_date: str) -> list[ReportSection]:
    return [
        _section("relato-neutro", "Relato neutro", [("Voce relatou", text, True), ("Data do registro", report_date, False)]),
        _section("lembrado-incerto", "Partes lembradas e partes incertas", [("Partes lembradas", text, True), ("Partes incertas", _find_context(text, ["nao lembro", "incerto", "confuso", "duvida", "talvez"]), True)]),
        _section("sentimentos", "Sentimentos relatados", [("Sentimentos", _find_context(text, ["medo", "vergonha", "triste", "culpa", "raiva", "ansiedade"]), True)]),
        _section("limites-apoio", "Limites e apoio desejado", [("Limites", _find_context(text, ["nao quero", "limite", "preciso de tempo", "nao consigo falar"]), True), ("Apoio desejado", _find_context(text, ["apoio", "ajuda", "conversar", "profissional", "amiga", "familia"]), True)]),
        _section("sem-conclusao", "Aviso de nao conclusao", [("Aviso", "Este registro nao conclui violencia, abuso, culpa, intencao ou responsabilidade. Ele organiza apenas o que voce relatou.", False)]),
    ]


def _q(category: str, text: str, why: str) -> SuggestedQuestion:
    return SuggestedQuestion(category=category, text=text, why_it_may_help=why)  # type: ignore[arg-type]


def _section(section_id: str, title: str, values: list[tuple[str, str, bool]]) -> ReportSection:
    return ReportSection(
        id=section_id,
        title=title,
        items=[
            ReportSectionItem(label=label, value=value or NOT_INFORMED, sensitive=sensitive, missing=(value == NOT_INFORMED))
            for label, value, sensitive in values
        ],
    )


def _format_date(value: date | None) -> str:
    return value.isoformat() if value else NOT_INFORMED


def _find_context(text: str, needles: list[str]) -> str:
    normalized = text.lower()
    if any(needle in normalized for needle in needles):
        return text
    return NOT_INFORMED


def _summary_for(purpose: ReportPurpose, text: str) -> str:
    prefix = {
        ReportPurpose.GYNECOLOGIST: "Voce relatou sinais fisicos para organizar antes de uma consulta ginecologica:",
        ReportPurpose.PSYCHOLOGIST: "Voce relatou uma experiencia com impacto emocional para conversar com cuidado:",
        ReportPurpose.OBSTETRICS: "Voce relatou informacoes que podem ser uteis em avaliacao obstetrica:",
        ReportPurpose.PERSONAL: "Voce registrou para acompanhar no seu proprio ritmo:",
        ReportPurpose.SENSITIVE_SITUATION: "Voce relatou uma situacao sensivel sem conclusao automatica:",
    }.get(purpose, "Voce relatou:")
    return f"{prefix} {text}"


def _missing_fields(sections: list[ReportSection]) -> dict[str, str]:
    missing: dict[str, str] = {}
    for section in sections:
        for item in section.items:
            if item.value == NOT_INFORMED:
                missing[f"{section.id}.{item.label.lower().replace(' ', '_')}"] = NOT_INFORMED
    return missing


def _format_share_text(report: StructuredReport) -> str:
    lines = [report.title, "", report.summary, ""]
    for section in report.sections:
        lines.extend([section.title])
        lines.extend(f"- {item.label}: {item.value}" for item in section.items)
        lines.append("")
    lines.extend(["Perguntas sugeridas"])
    lines.extend(f"- {question.text}" for question in report.suggested_questions)
    lines.extend(["", report.non_diagnostic_notice])
    return "\n".join(lines).strip()
