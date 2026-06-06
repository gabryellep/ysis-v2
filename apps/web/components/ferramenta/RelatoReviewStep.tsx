"use client";

import { motion } from "framer-motion";
import type { RelatoDraft } from "@/lib/session/experience-state";

type RelatoReviewStepProps = {
  draft: RelatoDraft;
  onChange: (draft: Partial<RelatoDraft>) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function RelatoReviewStep({ draft, onChange, onBack, onContinue }: RelatoReviewStepProps) {
  const wordCount = draft.text.trim() ? draft.text.trim().split(/\s+/).length : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="flex min-h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm text-muted transition hover:text-ink">
          <span>&lt;-</span>
          Voltar
        </button>
        <div className="font-mono text-xs text-muted">{wordCount > 0 ? `${wordCount} palavras` : "revisao"}</div>
      </div>

      <section className="grid flex-1 gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="rounded-[2rem] border border-[rgba(103,43,66,0.08)] bg-[linear-gradient(135deg,rgba(255,251,246,0.92),rgba(188,167,219,0.14))] p-6 shadow-[0_16px_48px_rgba(103,43,66,0.055)]">
          <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--color-lavender-deep))]">revisao</p>
          <h1 className="mt-4 font-display text-4xl italic leading-tight text-ink">Revise antes de seguir</h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            Ajuste palavras, apague o que nao quiser manter e deixe apenas o que faz sentido para voce agora.
          </p>
          <div className="mt-6 rounded-2xl bg-white/48 p-4 text-sm leading-6 text-muted">
            Este material organiza o relato. Ele nao substitui atendimento profissional e nao faz diagnostico.
          </div>
        </div>

        <div className="rounded-[2rem] border border-[rgba(103,43,66,0.08)] bg-[rgb(var(--color-paper))] p-5 shadow-[0_16px_48px_rgba(103,43,66,0.055)] lg:p-7">
          <textarea
            value={draft.text}
            onChange={(event) => onChange({ text: event.target.value })}
            aria-label="Revisar relato"
            className="min-h-[440px] w-full resize-none bg-transparent text-base leading-8 text-ink outline-none"
          />
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={onBack} className="rounded-xl bg-[rgba(188,167,219,0.2)] px-4 py-2.5 text-sm text-[rgb(var(--color-lavender-deep))] transition hover:bg-[rgba(188,167,219,0.34)]">
          Editar relato
        </button>
        <button type="button" onClick={onContinue} disabled={!draft.text.trim()} className="rounded-xl bg-[rgb(var(--color-wine))] px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-[rgba(103,43,66,0.9)] disabled:cursor-not-allowed disabled:opacity-45">
          Escolher finalidade
        </button>
      </div>
    </motion.div>
  );
}
