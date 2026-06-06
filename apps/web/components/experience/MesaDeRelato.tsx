"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PrivacyConsentStep } from "@/components/ferramenta/PrivacyConsentStep";
import { RelatoPurposeStep } from "@/components/ferramenta/RelatoPurposeStep";
import { RelatoReportStep } from "@/components/ferramenta/RelatoReportStep";
import { RelatoReviewStep } from "@/components/ferramenta/RelatoReviewStep";
import { CapsulaDeVoz } from "@/components/intake/CapsulaDeVoz";
import { EditorDeRelato } from "@/components/intake/EditorDeRelato";
import type { MesaMode, RelatoDraft, WorkspaceView } from "@/lib/session/experience-state";
import type { ConsentKey } from "@/lib/ysis/privacy";

type MesaDeRelatoProps = {
  mode: MesaMode;
  draft: RelatoDraft;
  discreetMode: boolean;
  onDraftChange: (draft: Partial<RelatoDraft>) => void;
  onModeChange: (mode: MesaMode) => void;
  onDiscreetModeChange: (enabled: boolean) => void;
  onStartNew: () => void;
  onNavigate: (view: WorkspaceView) => void;
};

export function MesaDeRelato({ mode, draft, discreetMode, onDraftChange, onModeChange, onDiscreetModeChange, onStartNew, onNavigate }: MesaDeRelatoProps) {
  const previousInputStep = draft.inputMode === "voice" ? "voice" : "writing";
  const copy = getDiscreetCopy(discreetMode);

  function updateConsent(key: ConsentKey, value: boolean) {
    onDraftChange({ consent: { ...draft.consent, [key]: value } });
  }

  function deleteSession() {
    onStartNew();
  }

  return (
    <AnimatePresence mode="wait">
      {mode === "privacy" ? (
        <PrivacyConsentStep
          key="privacy"
          consent={draft.consent}
          discreetMode={discreetMode}
          onConsentChange={updateConsent}
          onDiscreetModeChange={onDiscreetModeChange}
          onBack={() => onNavigate("home")}
          onContinue={() => onModeChange("rest")}
        />
      ) : null}
      {mode === "rest" ? <ChooseMode key="choose" copy={copy.choose} onBack={() => onNavigate("home")} onWrite={() => {
        onDraftChange({ inputMode: "writing" });
        onModeChange("writing");
      }} onVoice={() => {
        onDraftChange({ inputMode: "voice" });
        onModeChange("voice");
      }} /> : null}
      {mode === "writing" ? (
        <EditorDeRelato
          key="write"
          draft={draft}
          discreetMode={discreetMode}
          onChange={(nextDraft) => onDraftChange({ ...nextDraft, inputMode: "writing" })}
          onClear={() => onDraftChange({ text: "", quickNote: "" })}
          onBack={() => onModeChange("rest")}
          onReview={() => onModeChange("review")}
          onPreferVoice={() => onModeChange("voice")}
        />
      ) : null}
      {mode === "voice" ? (
        <CapsulaDeVoz
          key="voice"
          draft={draft}
          discreetMode={discreetMode}
          onChange={onDraftChange}
          onBack={() => onModeChange("rest")}
          onReview={() => onModeChange("review")}
          onSwitchToWrite={() => {
            onDraftChange({ inputMode: "writing" });
            onModeChange("writing");
          }}
        />
      ) : null}
      {mode === "review" ? (
        <RelatoReviewStep
          key="review"
          draft={draft}
          discreetMode={discreetMode}
          onChange={onDraftChange}
          onBack={() => onModeChange(previousInputStep)}
          onContinue={() => onModeChange("purpose")}
          onDeleteSession={deleteSession}
        />
      ) : null}
      {mode === "purpose" ? (
        <RelatoPurposeStep
          key="purpose"
          value={draft.purpose}
          discreetMode={discreetMode}
          onChange={(purpose) => onDraftChange({ purpose })}
          onBack={() => onModeChange("review")}
          onContinue={() => onModeChange("demo-report")}
        />
      ) : null}
      {mode === "demo-report" && draft.purpose ? (
        <RelatoReportStep
          key="demo-report"
          relato={draft.text}
          purpose={draft.purpose}
          discreetMode={discreetMode}
          inputMode={draft.inputMode}
          onBack={() => onModeChange("purpose")}
          onEditRelato={() => onModeChange("review")}
          onStartNew={deleteSession}
        />
      ) : null}
    </AnimatePresence>
  );
}

type ChooseCopy = {
  kicker: string;
  title: string;
  text: string;
  writeTitle: string;
  writeText: string;
  voiceTitle: string;
  voiceText: string;
};

function ChooseMode({ copy, onBack, onWrite, onVoice }: { copy: ChooseCopy; onBack: () => void; onWrite: () => void; onVoice: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="flex min-h-full flex-col">
      <button type="button" onClick={onBack} className="mb-8 flex w-fit items-center gap-2 text-sm text-muted transition hover:text-ink">
        <span>&lt;-</span>
        Voltar
      </button>

      <div className="mb-12 text-center">
        <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="mb-4 inline-flex items-center gap-2 rounded-full bg-[rgba(188,167,219,0.24)] px-4 py-2 text-sm text-[rgb(var(--color-lavender-deep))]">
          <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--color-lavender-deep))]" />
          {copy.kicker}
        </motion.div>
        <h1 className="mx-auto max-w-3xl font-display text-4xl italic leading-tight text-ink lg:text-5xl">{copy.title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted lg:text-base">{copy.text}</p>
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 lg:flex-row lg:gap-6">
        <motion.div aria-hidden animate={{ rotate: 360, scale: [1, 1.04, 1] }} transition={{ rotate: { duration: 34, repeat: Infinity, ease: "linear" }, scale: { duration: 6, repeat: Infinity, ease: "easeInOut" } }} className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-[42%] bg-[radial-gradient(circle,rgba(188,167,219,0.28),transparent_68%)]" />
        <motion.div aria-hidden animate={{ y: [0, -12, 0], rotate: [-5, 4, -5] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="pointer-events-none absolute -bottom-10 left-[38%] hidden h-24 w-48 rounded-full border border-white/60 bg-white/20 shadow-[0_20px_70px_rgba(184,101,118,0.1)] backdrop-blur-[18px] lg:block" />
        <motion.button type="button" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} onClick={onWrite} className="group relative min-h-[22rem] flex-1 overflow-hidden rounded-[2rem] border border-[rgba(103,43,66,0.08)] bg-[linear-gradient(135deg,rgb(var(--color-paper)),rgba(231,176,184,0.14))] p-6 text-left shadow-[0_16px_48px_rgba(103,43,66,0.055)] transition hover:-translate-y-0.5 lg:p-8">
          <div aria-hidden className="absolute right-0 top-0 h-40 w-40 -translate-y-1/2 translate-x-1/2 rounded-full bg-[rgba(231,176,184,0.24)] transition-transform duration-500 group-hover:scale-125" />
          <motion.div aria-hidden animate={{ rotate: [-4, 5, -4], y: [0, -10, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-7 right-7 h-32 w-28 rounded-[1.5rem] bg-white/42 p-3 shadow-[0_16px_48px_rgba(103,43,66,0.08)] backdrop-blur-[18px]">
            <span className="block h-1.5 rounded-full bg-[rgba(103,43,66,0.16)]" />
            <span className="mt-2 block h-1.5 w-4/5 rounded-full bg-[rgba(184,101,118,0.22)]" />
            <span className="mt-2 block h-1.5 w-2/3 rounded-full bg-[rgba(129,94,158,0.2)]" />
          </motion.div>
          <div className="relative z-10">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(231,176,184,0.28)] font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-wine">txt</div>
            <h2 className="text-2xl font-semibold text-ink">{copy.writeTitle}</h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted">{copy.writeText}</p>
          </div>
        </motion.button>

        <motion.button type="button" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} onClick={onVoice} className="group relative min-h-[22rem] flex-1 overflow-hidden rounded-[2rem] border border-[rgba(103,43,66,0.08)] bg-[linear-gradient(135deg,rgb(var(--color-paper)),rgba(188,167,219,0.18))] p-6 text-left shadow-[0_16px_48px_rgba(103,43,66,0.055)] transition hover:-translate-y-0.5 lg:p-8">
          <div aria-hidden className="absolute right-0 top-0 h-40 w-40 -translate-y-1/2 translate-x-1/2 rounded-full bg-[rgba(188,167,219,0.24)] transition-transform duration-500 group-hover:scale-125" />
          <motion.div aria-hidden animate={{ opacity: [0.78, 1, 0.78], x: [0, 8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-9 right-7 flex h-24 w-40 items-center justify-center gap-1 rounded-full bg-[rgba(224,215,255,0.36)] shadow-[0_16px_48px_rgba(129,94,158,0.11)] backdrop-blur-[18px]">
            {[12, 28, 18, 36, 24, 16].map((height, index) => (
              <motion.span key={index} animate={{ height: [height, height + 10, height] }} transition={{ duration: 1.3, repeat: Infinity, delay: index * 0.09 }} className="w-1.5 rounded-full bg-[linear-gradient(180deg,rgb(var(--color-lavender)),rgb(var(--color-lavender-deep)))]" />
            ))}
          </motion.div>
          <div className="relative z-10">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(188,167,219,0.34)] font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--color-lavender-deep))]">voz</div>
            <h2 className="text-2xl font-semibold text-ink">{copy.voiceTitle}</h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted">{copy.voiceText}</p>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}

function getDiscreetCopy(discreetMode: boolean) {
  if (discreetMode) {
    return {
      choose: {
        kicker: "Registro pessoal",
        title: "Voce prefere escrever ou simular fala?",
        text: "Escolha o formato mais confortavel para organizar seu bem-estar agora.",
        writeTitle: "Escrever",
        writeText: "Digite no seu ritmo e organize os pontos que deseja lembrar.",
        voiceTitle: "Simular fala",
        voiceText: "Grave audio temporario para gerar um texto revisavel, sem salvar por padrao."
      }
    };
  }

  return {
    choose: {
      kicker: "Mesa de relato",
      title: "Voce prefere escrever ou falar?",
      text: "Escolha o que for mais confortavel agora. Voce segue no seu ritmo.",
      writeTitle: "Escrever",
      writeText: "Digite no seu ritmo, organize seus pensamentos enquanto escreve.",
      voiceTitle: "Falar",
      voiceText: "Grave sua fala para gerar uma transcricao editavel antes de continuar."
    }
  };
}
