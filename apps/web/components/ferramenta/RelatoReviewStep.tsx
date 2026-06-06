"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { DeleteSessionAction } from "@/components/ferramenta/DeleteSessionAction";
import type { RelatoDraft } from "@/lib/session/experience-state";

type RelatoReviewStepProps = {
  draft: RelatoDraft;
  discreetMode: boolean;
  onChange: (draft: Partial<RelatoDraft>) => void;
  onBack: () => void;
  onContinue: () => void;
  onDeleteSession: () => void;
};

type OrganizarRelatoEnvelope = {
  ok: boolean;
  result?: {
    revised?: {
      short?: string;
      medium?: string;
      complete?: string;
    };
    topics?: Array<{ label: string; note?: string }>;
    revision_questions?: string[];
    missing_fields?: Record<string, string>;
    provider?: "mock" | "openai";
    provider_mode?: "mock" | "real";
    attempted_provider?: "mock" | "openai" | null;
    fallback_reason?: string | null;
  };
};

const API_BASE_URL = process.env.NEXT_PUBLIC_YSIS_API_URL ?? "http://127.0.0.1:8000";

export function RelatoReviewStep({ draft, discreetMode, onChange, onBack, onContinue, onDeleteSession }: RelatoReviewStepProps) {
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [organizationMessage, setOrganizationMessage] = useState<string | null>(null);
  const [organizationError, setOrganizationError] = useState<string | null>(null);
  const wordCount = draft.text.trim() ? draft.text.trim().split(/\s+/).length : 0;

  async function organizeWithAI() {
    const text = draft.text.trim();
    if (!text || isOrganizing) return;

    setIsOrganizing(true);
    setOrganizationError(null);
    setOrganizationMessage(discreetMode ? "Organizando seu registro..." : "Organizando seu relato com cuidado...");

    try {
      const response = await fetch(`${API_BASE_URL}/relatos/organizar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action_id: `organize-${Date.now()}`,
          consent: {
            granted: true,
            text_version: "ai-processing-phase7b-v1",
            granted_at: new Date().toISOString(),
            scopes: ["ai_processing", "temporary_processing", "no_persistence", "review_required"],
          },
          client_context: {
            mode: "guest",
            discreet_mode: discreetMode,
            source_screen: "ferramenta",
          },
          original: {
            text,
            input_mode: draft.inputMode === "voice" ? "voice_transcript" : "written",
            language: "pt-BR",
          },
        }),
      });

      if (!response.ok) throw new Error("organize_failed");

      const payload = (await response.json()) as OrganizarRelatoEnvelope;
      const result = payload.result;
      const nextText = result?.revised?.medium || result?.revised?.complete || result?.revised?.short;
      if (!nextText?.trim()) throw new Error("empty_organization");

      onChange({ text: nextText });
      const providerLabel = result?.provider_mode === "real" ? "IA real no backend" : "modo mock seguro";
      setOrganizationMessage(`Rascunho organizado em ${providerLabel}. Revise tudo antes de continuar.`);
    } catch {
      setOrganizationError(discreetMode ? "Nao foi possivel organizar agora. Voce pode seguir com seu texto manual." : "Nao foi possivel organizar agora. Voce pode seguir com seu relato manual.");
      setOrganizationMessage(null);
    } finally {
      setIsOrganizing(false);
    }
  }

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
          <h1 className="mt-4 font-display text-4xl italic leading-tight text-ink">{discreetMode ? "Revise seu registro" : "Revise antes de seguir"}</h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            {discreetMode ? "Ajuste palavras, apague o que nao quiser manter e deixe apenas o que faz sentido agora." : "Ajuste palavras, apague o que nao quiser manter e deixe apenas o que faz sentido para voce agora."}
          </p>
          <div className="mt-6 rounded-2xl bg-white/48 p-4 text-sm leading-6 text-muted">
            Este material organiza seu texto. Ele nao substitui atendimento profissional e nao faz diagnostico.
          </div>
          <button type="button" onClick={organizeWithAI} disabled={!draft.text.trim() || isOrganizing} className="mt-5 w-full rounded-xl bg-[rgb(var(--color-lavender-deep))] px-4 py-2.5 text-sm font-semibold text-paper transition hover:bg-[rgba(129,94,158,0.9)] disabled:cursor-not-allowed disabled:opacity-45">
            {isOrganizing ? "Organizando..." : discreetMode ? "Organizar registro" : "Organizar com IA"}
          </button>
          {organizationMessage ? <p className="mt-3 rounded-2xl bg-white/48 p-3 text-sm leading-6 text-muted">{organizationMessage}</p> : null}
          {organizationError ? <p className="mt-3 rounded-2xl bg-[rgba(231,176,184,0.18)] p-3 text-sm leading-6 text-wine">{organizationError}</p> : null}
        </div>

        <div className="rounded-[2rem] border border-[rgba(103,43,66,0.08)] bg-[rgb(var(--color-paper))] p-5 shadow-[0_16px_48px_rgba(103,43,66,0.055)] lg:p-7">
          <textarea
            value={draft.text}
            onChange={(event) => onChange({ text: event.target.value })}
            aria-label={discreetMode ? "Revisar registro" : "Revisar relato"}
            className="min-h-[440px] w-full resize-none bg-transparent text-base leading-8 text-ink outline-none"
          />
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={onBack} className="rounded-xl bg-[rgba(188,167,219,0.2)] px-4 py-2.5 text-sm text-[rgb(var(--color-lavender-deep))] transition hover:bg-[rgba(188,167,219,0.34)]">
          {discreetMode ? "Editar registro" : "Editar relato"}
        </button>
        <DeleteSessionAction onDelete={onDeleteSession} />
        <button type="button" onClick={onContinue} disabled={!draft.text.trim()} className="rounded-xl bg-[rgb(var(--color-wine))] px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-[rgba(103,43,66,0.9)] disabled:cursor-not-allowed disabled:opacity-45">
          Escolher finalidade
        </button>
      </div>
    </motion.div>
  );
}
