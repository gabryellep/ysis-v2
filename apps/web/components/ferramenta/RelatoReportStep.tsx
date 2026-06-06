"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { DeleteSessionAction } from "@/components/ferramenta/DeleteSessionAction";
import type { RelatoPurpose, StructuredReport, StructuredReportQuestion, StructuredReportSection } from "@/lib/ysis/types";

type RelatoReportStepProps = {
  relato: string;
  purpose: RelatoPurpose;
  discreetMode: boolean;
  inputMode: "writing" | "voice" | null;
  onBack: () => void;
  onEditRelato: () => void;
  onStartNew: () => void;
};

type GerarRelatorioEnvelope = {
  ok: boolean;
  result?: {
    report?: StructuredReport;
    message?: string;
  };
};

type CopyTarget = "full" | "short" | "questions" | "consultation" | `section:${string}`;
type EditingTarget = "summary" | "questions" | "consultation" | string | null;

type ConsultationPrep = {
  questionsToAsk: string;
  hardToSay: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_YSIS_API_URL ?? "http://127.0.0.1:8000";

const SHARE_REMINDERS = [
  "Revise, edite ou remova informacoes que voce nao queira compartilhar.",
  "Este relatorio nao substitui atendimento profissional.",
  "A Ysis nao salva este conteudo por padrao.",
  "Compartilhe apenas com pessoas ou profissionais de confianca.",
];

export function RelatoReportStep({ relato, purpose, discreetMode, inputMode, onBack, onEditRelato, onStartNew }: RelatoReportStepProps) {
  const [copyState, setCopyState] = useState<CopyTarget | "failed" | "idle">("idle");
  const [report, setReport] = useState<StructuredReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reportError, setReportError] = useState<string | null>(null);
  const [activeVersion, setActiveVersion] = useState<"short" | "full">("full");
  const [editingTarget, setEditingTarget] = useState<EditingTarget>(null);
  const [consultationPrep, setConsultationPrep] = useState<ConsultationPrep>({ questionsToAsk: "", hardToSay: "" });

  const shortVersion = useMemo(() => (report ? formatShortVersion(report) : ""), [report]);
  const fullVersion = useMemo(() => (report ? formatFullReport(report) : ""), [report]);
  const questionsText = useMemo(() => (report ? formatQuestions(report.suggested_questions) : ""), [report]);
  const consultationText = useMemo(() => (report ? formatConsultationPrep(report, consultationPrep) : ""), [report, consultationPrep]);

  useEffect(() => {
    let cancelled = false;

    async function generateReport() {
      const text = relato.trim();
      if (!text) {
        setReportError(discreetMode ? "Revise seu registro antes de gerar o documento." : "Revise seu relato antes de gerar o relatorio.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setReportError(null);
      setReport(null);
      setEditingTarget(null);
      setConsultationPrep({ questionsToAsk: "", hardToSay: "" });

      try {
        const response = await fetch(`${API_BASE_URL}/relatorios/gerar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action_id: `report-${Date.now()}`,
            consent: {
              granted: true,
              text_version: "report-generation-phase8-v1",
              granted_at: new Date().toISOString(),
              scopes: ["ai_processing", "temporary_processing", "no_persistence", "review_required"],
            },
            client_context: {
              mode: "guest",
              discreet_mode: discreetMode,
              source_screen: "ferramenta",
            },
            purpose,
            original: {
              text,
              input_mode: inputMode === "voice" ? "voice_transcript" : "written",
              language: "pt-BR",
            },
            revised: {
              short: text.slice(0, 1200),
              medium: text.slice(0, 3000),
              complete: text,
              user_can_edit: true,
            },
            report_date: new Date().toISOString().slice(0, 10),
            source_record_ids: [],
          }),
        });

        if (!response.ok) throw new Error("report_failed");
        const payload = (await response.json()) as GerarRelatorioEnvelope;
        if (!payload.ok || !payload.result?.report) throw new Error(payload.result?.message || "unsafe_report");
        if (!cancelled) setReport(payload.result.report);
      } catch {
        if (!cancelled) {
          setReportError(discreetMode ? "Nao foi possivel gerar o documento agora. Seu texto continua editavel e nada foi salvo." : "Nao foi possivel gerar o relatorio agora. Seu relato continua editavel e nada foi salvo.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void generateReport();
    return () => {
      cancelled = true;
    };
  }, [discreetMode, inputMode, purpose, relato]);

  function updateReport(nextReport: StructuredReport) {
    setReport(nextReport);
  }

  async function copyText(target: CopyTarget, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState(target);
    } catch {
      setCopyState("failed");
    }
    window.setTimeout(() => setCopyState("idle"), 3200);
  }

  function printReport() {
    window.print();
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="ysis-print-root flex min-h-full flex-col">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }

          .ysis-print-root,
          .ysis-print-root * {
            visibility: visible;
          }

          .ysis-print-root {
            position: absolute;
            inset: 0;
            width: 100%;
            background: white !important;
            color: #241f23 !important;
          }

          .ysis-no-print {
            display: none !important;
          }

          .ysis-print-paper {
            border: 0 !important;
            box-shadow: none !important;
            background: white !important;
            padding: 0 !important;
          }

          .ysis-print-section {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="ysis-no-print mb-6 flex items-center justify-between">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm text-muted transition hover:text-ink">
          <span>&lt;-</span>
          Voltar
        </button>
        <span className="rounded-full bg-[rgba(188,167,219,0.22)] px-3 py-1.5 text-xs text-[rgb(var(--color-lavender-deep))]">revisavel e local</span>
      </div>

      <section className="grid flex-1 gap-5 xl:grid-cols-[0.72fr_1.28fr]">
        <aside className="ysis-no-print rounded-[2rem] border border-[rgba(103,43,66,0.08)] bg-[linear-gradient(135deg,rgba(255,251,246,0.94),rgba(231,176,184,0.18),rgba(188,167,219,0.14))] p-6 shadow-[0_16px_48px_rgba(103,43,66,0.055)]">
          <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-wine">{discreetMode ? "documento" : "relatorio"}</p>
          <h1 className="mt-4 font-display text-4xl italic leading-tight text-ink">{report?.title ?? (discreetMode ? "Gerando documento" : "Gerando relatorio")}</h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            {report?.tone ?? "Revise o conteudo antes de usar. A Ysis organiza o texto, mas nao interpreta sintomas como diagnostico."}
          </p>

          <SafetyReminder />

          <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-white/48 p-1.5 text-sm">
            <button type="button" onClick={() => setActiveVersion("short")} className={`rounded-xl px-3 py-2 transition ${activeVersion === "short" ? "bg-white text-wine shadow-sm" : "text-muted hover:text-ink"}`}>
              Versao curta
            </button>
            <button type="button" onClick={() => setActiveVersion("full")} className={`rounded-xl px-3 py-2 transition ${activeVersion === "full" ? "bg-white text-wine shadow-sm" : "text-muted hover:text-ink"}`}>
              Versao completa
            </button>
          </div>

          <div className="mt-5 space-y-3">
            <button type="button" onClick={() => copyText("full", fullVersion)} disabled={!report || isLoading} className="w-full rounded-xl bg-[rgb(var(--color-wine))] px-4 py-3 text-sm font-semibold text-paper transition hover:bg-[rgba(103,43,66,0.9)] disabled:cursor-not-allowed disabled:opacity-45">
              Copiar relatorio completo
            </button>
            <button type="button" onClick={() => copyText("short", shortVersion)} disabled={!report || isLoading} className="w-full rounded-xl bg-white/62 px-4 py-3 text-sm font-semibold text-wine transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45">
              Copiar versao curta
            </button>
            <button type="button" onClick={() => copyText("questions", questionsText)} disabled={!report || isLoading} className="w-full rounded-xl bg-white/62 px-4 py-3 text-sm font-semibold text-wine transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45">
              Copiar perguntas sugeridas
            </button>
            <button type="button" onClick={printReport} disabled={!report || isLoading} className="w-full rounded-xl bg-[rgba(188,167,219,0.22)] px-4 py-3 text-sm font-semibold text-[rgb(var(--color-lavender-deep))] transition hover:bg-[rgba(188,167,219,0.34)] disabled:cursor-not-allowed disabled:opacity-45">
              Imprimir / salvar PDF
            </button>
            <button type="button" onClick={onEditRelato} className="w-full rounded-xl bg-white/48 px-4 py-3 text-sm text-wine transition hover:bg-white/70">
              {discreetMode ? "Editar registro original" : "Editar relato original"}
            </button>
            <DeleteSessionAction onDelete={onStartNew} label={discreetMode ? "Apagar registro" : "Apagar sessao"} />
          </div>

          <CopyFeedback copyState={copyState} />
        </aside>

        <article className="ysis-print-paper rounded-[2rem] border border-[rgba(103,43,66,0.08)] bg-[rgb(var(--color-paper))] p-5 shadow-[0_16px_48px_rgba(103,43,66,0.055)] lg:p-7">
          {isLoading ? <p className="text-sm leading-7 text-muted">{discreetMode ? "Organizando documento..." : "Organizando relatorio..."}</p> : null}
          {reportError ? (
            <div className="rounded-2xl bg-[rgba(231,176,184,0.18)] p-4 text-sm leading-6 text-wine">
              <p>{reportError}</p>
              <button type="button" onClick={onEditRelato} className="ysis-no-print mt-3 rounded-xl bg-white/60 px-4 py-2 text-sm font-semibold text-wine">
                Voltar e editar
              </button>
            </div>
          ) : null}
          {report ? (
            <div className="space-y-5">
              <PrintHeader report={report} />
              <VersionPreview activeVersion={activeVersion} shortVersion={shortVersion} fullVersion={fullVersion} />

              <EditableSummary report={report} editingTarget={editingTarget} onEdit={setEditingTarget} onChange={updateReport} />

              {report.sections.map((section) => (
                <EditableReportSection
                  key={section.id}
                  report={report}
                  section={section}
                  editingTarget={editingTarget}
                  onEdit={setEditingTarget}
                  onChange={updateReport}
                  onCopy={(text) => copyText(`section:${section.id}`, text)}
                />
              ))}

              <EditableQuestions report={report} editingTarget={editingTarget} onEdit={setEditingTarget} onChange={updateReport} onCopy={() => copyText("questions", questionsText)} />

              <ConsultationPrepSection
                report={report}
                value={consultationPrep}
                editingTarget={editingTarget}
                onEdit={setEditingTarget}
                onChange={setConsultationPrep}
                onCopy={() => copyText("consultation", consultationText)}
              />

              <section className="ysis-print-section rounded-2xl bg-[rgba(188,167,219,0.12)] p-4 text-xs leading-5 text-muted">
                <p>{report.non_diagnostic_notice}</p>
                <p className="mt-2">Revise antes de compartilhar. A edicao feita aqui fica apenas nesta sessao da pagina e nao e salva pela Ysis por padrao.</p>
                <p className="mt-2">{report.fallback_message}</p>
              </section>
            </div>
          ) : null}
        </article>
      </section>
    </motion.div>
  );
}

function SafetyReminder() {
  return (
    <div className="mt-5 space-y-2 rounded-2xl bg-white/52 p-4 text-xs leading-5 text-muted">
      {SHARE_REMINDERS.map((reminder) => (
        <p key={reminder}>{reminder}</p>
      ))}
    </div>
  );
}

function CopyFeedback({ copyState }: { copyState: CopyTarget | "failed" | "idle" }) {
  if (copyState === "idle") return null;

  return (
    <p className={`mt-4 rounded-2xl px-4 py-3 text-xs leading-5 ${copyState === "failed" ? "bg-[rgba(231,176,184,0.22)] text-wine" : "bg-white/58 text-muted"}`}>
      {copyState === "failed" ? "Nao foi possivel copiar agora. Voce ainda pode selecionar o texto manualmente." : "Copiado. Revise novamente antes de enviar para alguem."}
    </p>
  );
}

function PrintHeader({ report }: { report: StructuredReport }) {
  return (
    <header className="ysis-print-section border-b border-[rgba(103,43,66,0.1)] pb-5">
      <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-wine">Ysis V2</p>
      <h1 className="mt-2 font-display text-3xl italic leading-tight text-ink">{report.title}</h1>
      <p className="mt-3 text-sm leading-6 text-muted">{report.non_diagnostic_notice}</p>
      <p className="mt-2 text-xs leading-5 text-muted">Conteudo revisavel, nao persistido por padrao e preparado para conversa com profissional de confianca.</p>
    </header>
  );
}

function VersionPreview({ activeVersion, shortVersion, fullVersion }: { activeVersion: "short" | "full"; shortVersion: string; fullVersion: string }) {
  return (
    <section className="ysis-print-section rounded-2xl bg-white/54 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-ink">{activeVersion === "short" ? "Versao curta para iniciar conversa" : "Versao completa estruturada"}</h2>
        <span className="ysis-no-print text-xs text-muted">revisavel</span>
      </div>
      <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-muted">{activeVersion === "short" ? shortVersion : fullVersion}</pre>
    </section>
  );
}

function EditableSummary({ report, editingTarget, onEdit, onChange }: { report: StructuredReport; editingTarget: EditingTarget; onEdit: (target: EditingTarget) => void; onChange: (report: StructuredReport) => void }) {
  const isEditing = editingTarget === "summary";
  const [draft, setDraft] = useState(report.summary);

  useEffect(() => setDraft(report.summary), [report.summary]);

  function save() {
    onChange({ ...report, summary: draft });
    onEdit(null);
  }

  return (
    <section className="ysis-print-section border-b border-[rgba(103,43,66,0.08)] pb-5">
      <SectionHeading title="Resumo do relato" editable isEditing={isEditing} onEdit={() => onEdit("summary")} />
      {isEditing ? (
        <EditBox value={draft} onChange={setDraft} onCancel={() => {
          setDraft(report.summary);
          onEdit(null);
        }} onSave={save} />
      ) : (
        <p className="mt-3 text-sm leading-7 text-muted">{report.summary}</p>
      )}
    </section>
  );
}

function EditableReportSection({ report, section, editingTarget, onEdit, onChange, onCopy }: { report: StructuredReport; section: StructuredReportSection; editingTarget: EditingTarget; onEdit: (target: EditingTarget) => void; onChange: (report: StructuredReport) => void; onCopy: (text: string) => void }) {
  const isEditing = editingTarget === section.id;
  const [draft, setDraft] = useState(section);

  useEffect(() => setDraft(section), [section]);

  function save() {
    onChange({
      ...report,
      sections: report.sections.map((current) => (current.id === section.id ? draft : current)),
    });
    onEdit(null);
  }

  return (
    <section className="ysis-print-section border-b border-[rgba(103,43,66,0.08)] py-5">
      <SectionHeading title={section.title} editable isEditing={isEditing} onEdit={() => onEdit(section.id)} onCopy={() => onCopy(formatSection(section))} />
      {isEditing ? (
        <div className="mt-4 space-y-3">
          {draft.items.map((item, index) => (
            <div key={`${item.label}-${index}`} className="rounded-2xl bg-white/58 p-3">
              <label className="block text-xs font-semibold text-muted" htmlFor={`${section.id}-label-${index}`}>
                Rotulo
              </label>
              <input
                id={`${section.id}-label-${index}`}
                value={item.label}
                onChange={(event) => setDraft({ ...draft, items: draft.items.map((current, itemIndex) => (itemIndex === index ? { ...current, label: event.target.value } : current)) })}
                className="mt-1 w-full rounded-xl border border-[rgba(103,43,66,0.12)] bg-white px-3 py-2 text-sm text-ink outline-none focus:border-[rgb(var(--color-rose))]"
              />
              <label className="mt-3 block text-xs font-semibold text-muted" htmlFor={`${section.id}-value-${index}`}>
                Conteudo
              </label>
              <textarea
                id={`${section.id}-value-${index}`}
                value={item.value}
                onChange={(event) => setDraft({ ...draft, items: draft.items.map((current, itemIndex) => (itemIndex === index ? { ...current, value: event.target.value } : current)) })}
                rows={3}
                className="mt-1 w-full resize-y rounded-xl border border-[rgba(103,43,66,0.12)] bg-white px-3 py-2 text-sm leading-6 text-ink outline-none focus:border-[rgb(var(--color-rose))]"
              />
            </div>
          ))}
          <EditActions onCancel={() => {
            setDraft(section);
            onEdit(null);
          }} onSave={save} />
        </div>
      ) : (
        <ul className="mt-3 space-y-2">
          {section.items.map((item, index) => (
            <li key={`${item.label}-${index}`} className="flex gap-2 text-sm leading-6 text-muted">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--color-rose))]" />
              <span>
                <strong className="font-semibold text-ink">{item.label}:</strong> {item.value}
                {item.missing ? <span className="ml-2 text-xs text-muted">(revisar)</span> : null}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function EditableQuestions({ report, editingTarget, onEdit, onChange, onCopy }: { report: StructuredReport; editingTarget: EditingTarget; onEdit: (target: EditingTarget) => void; onChange: (report: StructuredReport) => void; onCopy: () => void }) {
  const isEditing = editingTarget === "questions";
  const [draft, setDraft] = useState(report.suggested_questions);

  useEffect(() => setDraft(report.suggested_questions), [report.suggested_questions]);

  function save() {
    onChange({ ...report, suggested_questions: draft });
    onEdit(null);
  }

  return (
    <section className="ysis-print-section border-b border-[rgba(103,43,66,0.08)] py-5">
      <SectionHeading title="Perguntas sugeridas" editable isEditing={isEditing} onEdit={() => onEdit("questions")} onCopy={onCopy} />
      {isEditing ? (
        <div className="mt-4 space-y-3">
          {draft.map((question, index) => (
            <div key={`${question.category}-${index}`} className="rounded-2xl bg-white/58 p-3">
              <label className="block text-xs font-semibold text-muted" htmlFor={`question-${index}`}>
                Pergunta
              </label>
              <textarea
                id={`question-${index}`}
                value={question.text}
                onChange={(event) => setDraft(draft.map((current, questionIndex) => (questionIndex === index ? { ...current, text: event.target.value } : current)))}
                rows={2}
                className="mt-1 w-full resize-y rounded-xl border border-[rgba(103,43,66,0.12)] bg-white px-3 py-2 text-sm leading-6 text-ink outline-none focus:border-[rgb(var(--color-rose))]"
              />
              <label className="mt-3 block text-xs font-semibold text-muted" htmlFor={`question-why-${index}`}>
                Por que pode ajudar
              </label>
              <textarea
                id={`question-why-${index}`}
                value={question.why_it_may_help}
                onChange={(event) => setDraft(draft.map((current, questionIndex) => (questionIndex === index ? { ...current, why_it_may_help: event.target.value } : current)))}
                rows={2}
                className="mt-1 w-full resize-y rounded-xl border border-[rgba(103,43,66,0.12)] bg-white px-3 py-2 text-sm leading-6 text-ink outline-none focus:border-[rgb(var(--color-rose))]"
              />
            </div>
          ))}
          <EditActions onCancel={() => {
            setDraft(report.suggested_questions);
            onEdit(null);
          }} onSave={save} />
        </div>
      ) : (
        <ul className="mt-3 space-y-3">
          {report.suggested_questions.map((question, index) => (
            <li key={`${question.category}-${index}`} className="rounded-2xl bg-white/48 p-3 text-sm leading-6 text-muted">
              <p className="font-semibold text-ink">{question.text}</p>
              <p className="mt-1 text-xs leading-5">{question.why_it_may_help}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ConsultationPrepSection({ report, value, editingTarget, onEdit, onChange, onCopy }: { report: StructuredReport; value: ConsultationPrep; editingTarget: EditingTarget; onEdit: (target: EditingTarget) => void; onChange: (value: ConsultationPrep) => void; onCopy: () => void }) {
  const isEditing = editingTarget === "consultation";
  const keyPoints = getMainPoints(report);

  return (
    <section className="ysis-print-section border-b border-[rgba(103,43,66,0.08)] py-5">
      <SectionHeading title="Preparar conversa" editable isEditing={isEditing} onEdit={() => onEdit("consultation")} onCopy={onCopy} />
      <div className="mt-3 space-y-3">
        <div className="rounded-2xl bg-[rgba(231,176,184,0.14)] p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-wine">Principais pontos</p>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-muted">
            {keyPoints.map((point) => (
              <li key={point}>- {point}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-white/48 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-wine">Perguntas sugeridas</p>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-muted">
            {report.suggested_questions.slice(0, 4).map((question) => (
              <li key={question.text}>- {question.text}</li>
            ))}
          </ul>
        </div>
        {isEditing ? (
          <div className="space-y-3">
            <LabeledTextarea label="O que quero perguntar" value={value.questionsToAsk} onChange={(questionsToAsk) => onChange({ ...value, questionsToAsk })} />
            <LabeledTextarea label="O que tenho medo ou vergonha de falar" value={value.hardToSay} onChange={(hardToSay) => onChange({ ...value, hardToSay })} />
            <EditActions onCancel={() => onEdit(null)} onSave={() => onEdit(null)} saveLabel="Concluir" />
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-2xl bg-white/48 p-3 text-sm leading-6 text-muted">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-wine">O que quero perguntar</p>
              <p className="mt-2 whitespace-pre-wrap">{value.questionsToAsk || "Escreva aqui antes da consulta, se desejar."}</p>
            </div>
            <div className="rounded-2xl bg-white/48 p-3 text-sm leading-6 text-muted">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-wine">O que tenho medo ou vergonha de falar</p>
              <p className="mt-2 whitespace-pre-wrap">{value.hardToSay || "Voce pode anotar com suas palavras e editar quando quiser."}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SectionHeading({ title, editable, isEditing, onEdit, onCopy }: { title: string; editable?: boolean; isEditing?: boolean; onEdit?: () => void; onCopy?: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {editable ? <p className="ysis-no-print mt-1 text-xs text-muted">{isEditing ? "Editando localmente nesta sessao." : "Esta secao pode ser editada antes de compartilhar."}</p> : null}
      </div>
      <div className="ysis-no-print flex gap-2">
        {onCopy ? (
          <button type="button" onClick={onCopy} className="rounded-xl bg-white/62 px-3 py-2 text-xs font-semibold text-wine transition hover:bg-white">
            Copiar
          </button>
        ) : null}
        {onEdit ? (
          <button type="button" onClick={onEdit} className="rounded-xl bg-[rgba(188,167,219,0.22)] px-3 py-2 text-xs font-semibold text-[rgb(var(--color-lavender-deep))] transition hover:bg-[rgba(188,167,219,0.34)]">
            {isEditing ? "Editando" : "Editar"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function EditBox({ value, onChange, onCancel, onSave }: { value: string; onChange: (value: string) => void; onCancel: () => void; onSave: () => void }) {
  return (
    <div className="ysis-no-print mt-4">
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={6} className="w-full resize-y rounded-2xl border border-[rgba(103,43,66,0.12)] bg-white px-4 py-3 text-sm leading-7 text-ink outline-none focus:border-[rgb(var(--color-rose))]" />
      <EditActions onCancel={onCancel} onSave={onSave} />
    </div>
  );
}

function LabeledTextarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-xs font-semibold text-muted">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="mt-1 w-full resize-y rounded-xl border border-[rgba(103,43,66,0.12)] bg-white px-3 py-2 text-sm font-normal leading-6 text-ink outline-none focus:border-[rgb(var(--color-rose))]" />
    </label>
  );
}

function EditActions({ onCancel, onSave, saveLabel = "Salvar edicao" }: { onCancel: () => void; onSave: () => void; saveLabel?: string }) {
  return (
    <div className="ysis-no-print mt-3 flex flex-wrap gap-2">
      <button type="button" onClick={onSave} className="rounded-xl bg-[rgb(var(--color-wine))] px-4 py-2 text-sm font-semibold text-paper transition hover:bg-[rgba(103,43,66,0.9)]">
        {saveLabel}
      </button>
      <button type="button" onClick={onCancel} className="rounded-xl bg-white/62 px-4 py-2 text-sm font-semibold text-wine transition hover:bg-white">
        Cancelar
      </button>
    </div>
  );
}

function formatFullReport(report: StructuredReport) {
  return [
    report.title,
    "",
    report.non_diagnostic_notice,
    "",
    "Resumo",
    report.summary,
    "",
    ...report.sections.flatMap((section) => [section.title, ...section.items.map((item) => `- ${item.label}: ${item.value}`), ""]),
    "Perguntas sugeridas",
    ...report.suggested_questions.map((question) => `- ${question.text}`),
    "",
    "Avisos",
    "Revise, edite ou remova informacoes que voce nao queira compartilhar.",
    "A Ysis nao salva este conteudo por padrao.",
  ].join("\n");
}

function formatShortVersion(report: StructuredReport) {
  const mainPoints = getMainPoints(report).slice(0, 4);
  return [
    "Gostaria de conversar sobre alguns sintomas/situacoes que organizei. Nao estou buscando um diagnostico aqui, apenas quero explicar melhor o que percebi.",
    "",
    `Resumo curto: ${firstSentence(report.summary)}`,
    "",
    "Principais pontos:",
    ...mainPoints.map((point) => `- ${point}`),
    "",
    "Gostaria de orientacao sobre proximos passos, sinais de atencao e como acompanhar isso com seguranca.",
  ].join("\n");
}

function formatQuestions(questions: StructuredReportQuestion[]) {
  return ["Perguntas sugeridas", ...questions.map((question) => `- ${question.text}`)].join("\n");
}

function formatSection(section: StructuredReportSection) {
  return [section.title, ...section.items.map((item) => `- ${item.label}: ${item.value}`)].join("\n");
}

function formatConsultationPrep(report: StructuredReport, consultationPrep: ConsultationPrep) {
  return [
    "Para levar a consulta",
    "",
    "Principais pontos:",
    ...getMainPoints(report).map((point) => `- ${point}`),
    "",
    "Perguntas sugeridas:",
    ...report.suggested_questions.slice(0, 4).map((question) => `- ${question.text}`),
    "",
    "O que quero perguntar:",
    consultationPrep.questionsToAsk || "nao informado",
    "",
    "O que tenho medo ou vergonha de falar:",
    consultationPrep.hardToSay || "nao informado",
    "",
    report.non_diagnostic_notice,
  ].join("\n");
}

function getMainPoints(report: StructuredReport) {
  const points = report.sections.flatMap((section) =>
    section.items
      .filter((item) => item.value.trim() && item.value.trim().toLowerCase() !== "nao informado")
      .map((item) => `${item.label}: ${item.value}`)
  );

  if (points.length) return points.slice(0, 5);
  return [firstSentence(report.summary)];
}

function firstSentence(text: string) {
  const [sentence] = text.split(/(?<=[.!?])\s+/);
  return sentence?.trim() || text.trim() || "nao informado";
}
