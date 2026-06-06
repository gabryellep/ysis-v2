"use client";

import { motion } from "framer-motion";
import { ConsentChecklist } from "@/components/ferramenta/ConsentChecklist";
import { DiscreetModeToggle } from "@/components/ferramenta/DiscreetModeToggle";
import type { RelatoDraft } from "@/lib/session/experience-state";
import { hasMinimumConsent, privacyNotes, type ConsentKey } from "@/lib/ysis/privacy";

type PrivacyConsentStepProps = {
  consent: RelatoDraft["consent"];
  discreetMode: boolean;
  onConsentChange: (key: ConsentKey, value: boolean) => void;
  onDiscreetModeChange: (enabled: boolean) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function PrivacyConsentStep({ consent, discreetMode, onConsentChange, onDiscreetModeChange, onBack, onContinue }: PrivacyConsentStepProps) {
  const canContinue = hasMinimumConsent(consent);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="flex min-h-full flex-col">
      <div className="mb-6 flex items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm text-muted transition hover:text-ink">
          <span>&lt;-</span>
          Voltar
        </button>
        <DiscreetModeToggle enabled={discreetMode} onChange={onDiscreetModeChange} />
      </div>

      <section className="grid flex-1 gap-5 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="rounded-[2rem] border border-[rgba(103,43,66,0.08)] bg-[linear-gradient(135deg,rgba(255,251,246,0.92),rgba(45,33,43,0.08))] p-6 shadow-[0_16px_48px_rgba(103,43,66,0.055)] lg:p-8">
          <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-wine">privacidade</p>
          <h1 className="mt-4 font-display text-4xl italic leading-tight text-ink lg:text-5xl">
            Antes de comecar, voce controla este registro
          </h1>
          <div className="mt-6 space-y-3">
            {privacyNotes.map((note) => (
              <p key={note} className="rounded-2xl bg-white/50 p-4 text-sm leading-6 text-muted">
                {note}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[rgba(103,43,66,0.08)] bg-[rgb(var(--color-paper))] p-5 shadow-[0_16px_48px_rgba(103,43,66,0.055)] lg:p-7">
          <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--color-lavender-deep))]">consentimentos</p>
          <h2 className="mt-3 text-2xl font-semibold text-ink">Confirme para seguir</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Linguagem simples, sem juridiques: estes pontos existem para deixar claro o limite da demonstracao.
          </p>

          <div className="mt-6">
            <ConsentChecklist consent={consent} onChange={onConsentChange} />
          </div>

          <button type="button" onClick={onContinue} disabled={!canContinue} className="mt-6 w-full rounded-xl bg-[rgb(var(--color-wine))] px-5 py-3 text-sm font-semibold text-paper transition hover:bg-[rgba(103,43,66,0.9)] disabled:cursor-not-allowed disabled:opacity-45">
            Continuar
          </button>
        </div>
      </section>
    </motion.div>
  );
}
