"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { DeleteSessionAction } from "@/components/ferramenta/DeleteSessionAction";
import type { RelatoPurpose, StructuredReport } from "@/lib/ysis/types";

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

const API_BASE_URL = process.env.NEXT_PUBLIC_YSIS_API_URL ?? "http://127.0.0.1:8000";

export function RelatoReportStep({ relato, purpose, discreetMode, inputMode, onBack, onEditRelato, onStartNew }: RelatoReportStepProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [report, setReport] = useState<StructuredReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reportError, setReportError] = useState<string | null>(null);
  const reportText = useMemo(() => (report ? formatStructuredReport(report) : ""), [report]);

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

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(reportText);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    window.setTimeout(() => setCopyState("idle"), 2200);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="flex min-h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm text-muted transition hover:text-ink">
          <span>&lt;-</span>
          Voltar
        </button>
        <span className="rounded-full bg-[rgba(188,167,219,0.22)] px-3 py-1.5 text-xs text-[rgb(var(--color-lavender-deep))]">revisavel</span>
      </div>

      <section className="grid flex-1 gap-5 xl:grid-cols-[0.72fr_1.28fr]">
        <div className="rounded-[2rem] border border-[rgba(103,43,66,0.08)] bg-[linear-gradient(135deg,rgba(255,251,246,0.94),rgba(231,176,184,0.18),rgba(188,167,219,0.14))] p-6 shadow-[0_16px_48px_rgba(103,43,66,0.055)]">
          <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-wine">{discreetMode ? "documento" : "relatorio"}</p>
          <h1 className="mt-4 font-display text-4xl italic leading-tight text-ink">{report?.title ?? (discreetMode ? "Gerando documento" : "Gerando relatorio")}</h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            {report?.tone ?? "Revise o conteudo antes de usar. A Ysis organiza o texto, mas nao interpreta sintomas como diagnostico."}
          </p>

          <div className="mt-5 space-y-2 rounded-2xl bg-white/52 p-4 text-xs leading-5 text-muted">
            <p>{report?.non_diagnostic_notice ?? "Este material nao substitui atendimento profissional."}</p>
            <p>Voce controla o que deseja manter, editar, copiar ou apagar.</p>
            <p>{report?.fallback_message ?? "Quando faltar dado, a Ysis usa nao informado para evitar inventar informacao."}</p>
          </div>

          <div className="mt-6 space-y-3">
            <button type="button" onClick={copyReport} disabled={!report || isLoading} className="w-full rounded-xl bg-[rgb(var(--color-wine))] px-4 py-3 text-sm font-semibold text-paper transition hover:bg-[rgba(103,43,66,0.9)] disabled:cursor-not-allowed disabled:opacity-45">
              {copyState === "copied" ? (discreetMode ? "Documento copiado" : "Relatorio copiado") : copyState === "failed" ? "Nao foi possivel copiar" : isLoading ? "Gerando..." : discreetMode ? "Copiar documento" : "Copiar relatorio"}
            </button>
            <button type="button" onClick={onEditRelato} className="w-full rounded-xl bg-[rgba(188,167,219,0.22)] px-4 py-3 text-sm text-[rgb(var(--color-lavender-deep))] transition hover:bg-[rgba(188,167,219,0.34)]">
              {discreetMode ? "Editar registro" : "Editar relato"}
            </button>
            <DeleteSessionAction onDelete={onStartNew} label={discreetMode ? "Apagar registro" : "Apagar sessao"} />
          </div>
        </div>

        <article className="rounded-[2rem] border border-[rgba(103,43,66,0.08)] bg-[rgb(var(--color-paper))] p-5 shadow-[0_16px_48px_rgba(103,43,66,0.055)] lg:p-7">
          {isLoading ? <p className="text-sm leading-7 text-muted">{discreetMode ? "Organizando documento..." : "Organizando relatorio..."}</p> : null}
          {reportError ? (
            <div className="rounded-2xl bg-[rgba(231,176,184,0.18)] p-4 text-sm leading-6 text-wine">
              <p>{reportError}</p>
              <button type="button" onClick={onEditRelato} className="mt-3 rounded-xl bg-white/60 px-4 py-2 text-sm font-semibold text-wine">
                Voltar e editar
              </button>
            </div>
          ) : null}
          {report ? (
            <>
              <ReportSection title={discreetMode ? "Resumo do registro" : "Resumo do relato"} items={[report.summary]} prose />
              {report.sections.map((section) => (
                <ReportSection key={section.id} title={section.title} items={section.items.map((item) => `${item.label}: ${item.value}`)} />
              ))}
              <ReportSection title="Perguntas sugeridas" items={report.suggested_questions.map((question) => question.text)} />
            </>
          ) : null}
        </article>
      </section>
    </motion.div>
  );
}

function formatStructuredReport(report: StructuredReport) {
  if (report.share_text.trim()) return report.share_text;

  return [
    report.title,
    "",
    report.summary,
    "",
    ...report.sections.flatMap((section) => [section.title, ...section.items.map((item) => `- ${item.label}: ${item.value}`), ""]),
    "Perguntas sugeridas",
    ...report.suggested_questions.map((question) => `- ${question.text}`),
    "",
    report.non_diagnostic_notice,
  ].join("\n");
}

function ReportSection({ title, items, prose = false }: { title: string; items: string[]; prose?: boolean }) {
  return (
    <section className="border-b border-[rgba(103,43,66,0.08)] py-5 first:pt-0 last:border-b-0 last:pb-0">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      {prose ? (
        <p className="mt-3 text-sm leading-7 text-muted">{items[0]}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-6 text-muted">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--color-rose))]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
