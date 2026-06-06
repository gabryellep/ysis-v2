"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { RelatoDraft } from "@/lib/session/experience-state";

type VoiceState = "ready" | "recording" | "paused" | "finished";

type CapsulaDeVozProps = {
  draft: RelatoDraft;
  discreetMode: boolean;
  onChange: (draft: Partial<RelatoDraft>) => void;
  onBack: () => void;
  onReview: () => void;
  onSwitchToWrite: () => void;
};

export function CapsulaDeVoz({ draft, discreetMode, onChange, onBack, onReview, onSwitchToWrite }: CapsulaDeVozProps) {
  const [state, setState] = useState<VoiceState>("ready");
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (state !== "recording") return;
    const interval = window.setInterval(() => setDuration((current) => current + 1), 1000);
    return () => window.clearInterval(interval);
  }, [state]);

  function discard() {
    setState("ready");
    setDuration(0);
    onChange({ text: "" });
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="flex min-h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm text-muted transition hover:text-ink">
          <span>&lt;-</span>
          Voltar
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-3xl">
          <div className="relative min-h-[34rem] overflow-hidden rounded-[3rem] border border-[rgba(188,167,219,0.28)] bg-[linear-gradient(135deg,rgba(188,167,219,0.34),rgba(188,167,219,0.13),rgba(255,251,246,0.74))] p-8 shadow-[0_18px_54px_rgba(129,94,158,0.11)] lg:p-12">
            <div className="absolute inset-4 rounded-[2.5rem] bg-[rgba(255,251,246,0.56)] backdrop-blur-sm" />

            <div className="relative z-10 flex min-h-[27rem] flex-col items-center justify-center">
              <div className="mb-6 flex h-20 items-center gap-1.5">
                <VoiceWave state={state} />
              </div>

              {state !== "ready" ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 font-mono text-3xl text-[rgb(var(--color-lavender-deep))]">
                  {formatTime(duration)}
                </motion.div>
              ) : null}

              <AnimatePresence mode="wait">
                {state === "ready" ? (
                  <motion.button key="start" type="button" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={() => setState("recording")} className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[rgb(var(--color-lavender-deep))] text-paper transition hover:bg-[rgba(129,94,158,0.9)]">
                    <span className="absolute inset-0 animate-ping rounded-full bg-[rgba(129,94,158,0.24)]" />
                    <span className="relative font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em]">demo</span>
                  </motion.button>
                ) : null}

                {state === "recording" ? (
                  <motion.div key="recording" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex items-center gap-4">
                    <RoundAction onClick={() => setState("paused")} label="Pausar" tone="lavender" />
                    <RoundAction onClick={() => setState("finished")} label="Finalizar" tone="wine" />
                  </motion.div>
                ) : null}

                {state === "paused" ? (
                  <motion.div key="paused" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex items-center gap-4">
                    <RoundAction onClick={() => setState("recording")} label="Continuar" tone="lavender" />
                    <RoundAction onClick={() => setState("finished")} label="Revisar" tone="wine" />
                  </motion.div>
                ) : null}

                {state === "finished" ? (
                  <motion.div key="finished" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex flex-col items-center gap-4">
                    <p className="text-sm text-muted">Demonstracao concluida</p>
                    <textarea
                      value={draft.text}
                      onChange={(event) => onChange({ text: event.target.value, inputMode: "voice" })}
                      aria-label={discreetMode ? "Texto da demonstracao para revisao" : "Relato de voz para revisao"}
                      placeholder={discreetMode ? "Nesta demonstracao, escreva aqui os pontos que voce quer revisar." : "Nesta demonstracao, escreva aqui o que voce quer revisar depois de falar."}
                      className="min-h-32 w-full max-w-xl resize-none rounded-2xl border border-[rgba(103,43,66,0.08)] bg-[rgb(var(--color-paper))] p-4 text-sm leading-6 text-ink outline-none placeholder:text-muted/50"
                    />
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={discard} className="rounded-xl bg-[rgba(231,176,184,0.18)] px-4 py-2.5 text-sm text-wine transition hover:bg-[rgba(231,176,184,0.28)]">Descartar</button>
                      <button type="button" onClick={onReview} disabled={!draft.text.trim()} className="rounded-xl bg-[rgb(var(--color-wine))] px-4 py-2.5 text-sm font-semibold text-paper transition hover:bg-[rgba(103,43,66,0.9)] disabled:cursor-not-allowed disabled:opacity-45">Revisar</button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <p className="mt-6 text-center text-sm text-muted">{statusText(state)}</p>
              <p className="mt-2 text-center text-xs text-muted">Demonstracao visual. Nenhum audio esta sendo gravado nesta versao.</p>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--color-lavender-deep))]" />
            Modo demonstrativo: nenhum audio e gravado ou armazenado nesta fase
          </motion.div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6">
        <div className="mx-auto flex max-w-fit items-center justify-center gap-2 rounded-2xl border border-[rgba(103,43,66,0.08)] bg-[rgb(var(--color-paper))] p-2 shadow-[0_16px_48px_rgba(103,43,66,0.1)]">
          <button type="button" onClick={onSwitchToWrite} className="rounded-xl px-4 py-2.5 text-sm text-muted transition hover:bg-[rgba(231,176,184,0.18)] hover:text-wine">Escrever</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function VoiceWave({ state }: { state: VoiceState }) {
  const bars = Array.from({ length: 7 });
  return (
    <>
      {bars.map((_, index) => {
        if (state === "recording") {
          return <motion.span key={index} animate={{ scaleY: [0.35, 1, 0.45] }} transition={{ duration: 1, repeat: Infinity, delay: index * 0.1 }} className="h-16 w-2 origin-center rounded-full bg-[rgb(var(--color-lavender-deep))]" />;
        }
        if (state === "paused" || state === "finished") {
          return <span key={index} className="h-5 w-2 rounded-full bg-[rgba(129,94,158,0.5)]" />;
        }
        return <span key={index} className="h-2.5 w-2 rounded-full bg-[rgba(188,167,219,0.72)]" />;
      })}
    </>
  );
}

function RoundAction({ onClick, label, tone }: { onClick: () => void; label: string; tone: "lavender" | "wine" }) {
  const className =
    tone === "wine"
      ? "flex h-20 w-20 items-center justify-center rounded-full bg-[rgb(var(--color-wine))] text-xs font-semibold text-paper transition hover:bg-[rgba(103,43,66,0.9)]"
      : "flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(188,167,219,0.42)] text-[0.62rem] font-semibold text-[rgb(var(--color-lavender-deep))] transition hover:bg-[rgba(188,167,219,0.58)]";
  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

function statusText(state: VoiceState) {
  if (state === "recording") return "Simulacao visual em andamento, sem capturar audio";
  if (state === "paused") return "Simulacao pausada";
  if (state === "finished") return "Pronta para escrever e revisar antes de usar";
  return "Toque para iniciar a demonstracao";
}
