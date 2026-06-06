"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { buildDemoReport, formatDemoReport } from "@/lib/ysis/demo-report";
import type { RelatoPurpose } from "@/lib/ysis/types";

type RelatoReportStepProps = {
  relato: string;
  purpose: RelatoPurpose;
  onBack: () => void;
  onEditRelato: () => void;
  onStartNew: () => void;
};

export function RelatoReportStep({ relato, purpose, onBack, onEditRelato, onStartNew }: RelatoReportStepProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const report = useMemo(() => buildDemoReport(relato, purpose), [relato, purpose]);
  const reportText = useMemo(() => formatDemoReport(report), [report]);

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
        <span className="rounded-full bg-[rgba(188,167,219,0.22)] px-3 py-1.5 text-xs text-[rgb(var(--color-lavender-deep))]">demonstrativo</span>
      </div>

      <section className="grid flex-1 gap-5 xl:grid-cols-[0.72fr_1.28fr]">
        <div className="rounded-[2rem] border border-[rgba(103,43,66,0.08)] bg-[linear-gradient(135deg,rgba(255,251,246,0.94),rgba(231,176,184,0.18),rgba(188,167,219,0.14))] p-6 shadow-[0_16px_48px_rgba(103,43,66,0.055)]">
          <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-wine">relatorio</p>
          <h1 className="mt-4 font-display text-4xl italic leading-tight text-ink">{report.title}</h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            Revise o conteudo antes de usar. A Ysis organiza o relato, mas nao interpreta sintomas como diagnostico.
          </p>

          <div className="mt-6 space-y-3">
            <button type="button" onClick={copyReport} className="w-full rounded-xl bg-[rgb(var(--color-wine))] px-4 py-3 text-sm font-semibold text-paper transition hover:bg-[rgba(103,43,66,0.9)]">
              {copyState === "copied" ? "Relatorio copiado" : copyState === "failed" ? "Nao foi possivel copiar" : "Copiar relatorio"}
            </button>
            <button type="button" onClick={onEditRelato} className="w-full rounded-xl bg-[rgba(188,167,219,0.22)] px-4 py-3 text-sm text-[rgb(var(--color-lavender-deep))] transition hover:bg-[rgba(188,167,219,0.34)]">
              Editar relato
            </button>
            <button type="button" onClick={onStartNew} className="w-full rounded-xl bg-[rgba(231,176,184,0.18)] px-4 py-3 text-sm text-wine transition hover:bg-[rgba(231,176,184,0.28)]">
              Comecar novo relato
            </button>
          </div>
        </div>

        <article className="rounded-[2rem] border border-[rgba(103,43,66,0.08)] bg-[rgb(var(--color-paper))] p-5 shadow-[0_16px_48px_rgba(103,43,66,0.055)] lg:p-7">
          <ReportSection title="Resumo do relato" items={[report.summary]} prose />
          <ReportSection title="Pontos principais mencionados" items={report.mainPoints} />
          <ReportSection title="Sintomas ou situacoes relatadas" items={report.reportedSituations} />
          <ReportSection title="Perguntas que voce pode levar para atendimento" items={report.suggestedQuestions} />
          <ReportSection title="Observacoes importantes" items={report.importantNotes} />
        </article>
      </section>
    </motion.div>
  );
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
