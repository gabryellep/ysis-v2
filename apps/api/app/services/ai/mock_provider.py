from __future__ import annotations

from app.schemas.common import NOT_INFORMED
from app.schemas.relatos import (
    OrganizarRelatoRequest,
    OrganizarRelatoResult,
    RelatoRevisado,
    RelatoTopic,
    SuggestedFields,
)
from app.schemas.relatorios import PerguntasSugeridasResult, PrepararConversaRequest, SuggestedQuestion
from app.services.security.safety import sanitize_safety_language


def _limit_text(value: str, max_length: int) -> str:
    clean = sanitize_safety_language(value.strip())
    if len(clean) <= max_length:
        return clean
    return f"{clean[: max_length - 3].strip()}..."


def organize_report_mock(request: OrganizarRelatoRequest) -> OrganizarRelatoResult:
    text = _limit_text(request.original.text, 6000)
    short = _limit_text(text, 220) if text else NOT_INFORMED

    return OrganizarRelatoResult(
        original=request.original,
        revised=RelatoRevisado(short=short, medium=text or NOT_INFORMED, complete=text or NOT_INFORMED),
        topics=[
            RelatoTopic(
                label="Relato informado",
                user_words=[_limit_text(text, 280)] if text else [],
                note="Texto mantido como rascunho revisavel, sem conclusao clinica.",
            )
        ],
        suggested_fields=SuggestedFields(
            main_description=text or NOT_INFORMED,
            associated_notes=[],
            cycle_relation_text=NOT_INFORMED,
            emotional_context_text=NOT_INFORMED,
            sensitive_notes=NOT_INFORMED,
        ),
        revision_questions=[
            "O que voce quer manter neste rascunho?",
            "Ha alguma parte que voce prefere editar, reduzir ou apagar?",
            "Existe data, duracao ou contexto que voce queira acrescentar?",
        ],
        missing_fields={
            "duracao": NOT_INFORMED,
            "relacao_com_ciclo": NOT_INFORMED,
            "intensidade": NOT_INFORMED,
        },
    )


def suggest_questions_mock(request: PrepararConversaRequest) -> PerguntasSugeridasResult:
    questions = [
        SuggestedQuestion(
            category="observacao",
            text="Que informacoes do meu relato vale observar com mais calma?",
            why_it_may_help="Ajuda a abrir a conversa sem transformar o relato em conclusao.",
        ),
        SuggestedQuestion(
            category="contexto",
            text="Que contexto da minha rotina pode ser util comentar?",
            why_it_may_help="Ajuda a escolher detalhes que a usuaria quer compartilhar.",
        ),
        SuggestedQuestion(
            category="registro",
            text="O que seria importante eu anotar antes da proxima conversa?",
            why_it_may_help="Mantem o foco em registro e revisao.",
        ),
        SuggestedQuestion(
            category="seguranca",
            text="Em quais situacoes devo buscar apoio com mais urgencia?",
            why_it_may_help="Ajuda a conversar sobre limites de seguranca com profissional.",
        ),
        SuggestedQuestion(
            category="consulta",
            text="Quais informacoes adicionais podem ajudar na avaliacao profissional?",
            why_it_may_help="Organiza duvidas sem pedir diagnostico ou prescricao.",
        ),
    ]
    return PerguntasSugeridasResult(
        questions=questions[: request.max_questions],
        omitted=[],
        user_can_edit=True,
    )
