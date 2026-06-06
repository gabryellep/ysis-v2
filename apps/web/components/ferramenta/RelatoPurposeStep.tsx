"use client";

import { motion } from "framer-motion";
import type { RelatoPurpose } from "@/lib/ysis/types";

type RelatoPurposeStepProps = {
  value: RelatoPurpose | null;
  onChange: (purpose: RelatoPurpose) => void;
  onBack: () => void;
  onContinue: () => void;
};

const purposes: Array<{ id: RelatoPurpose; label: string; description: string; mark: string; tone: string }> = [
  { id: "consultation", label: "Levar para consulta", description: "Organizar um resumo para atendimento.", mark: "cons", tone: "rose" },
  { id: "symptoms", label: "Organizar sintomas", description: "Separar pontos, sintomas e contexto.", mark: "sint", tone: "lavender" },
  { id: "conversation", label: "Preparar conversa", description: "Criar perguntas e frases de apoio.", mark: "fala", tone: "honey" },
  { id: "personal", label: "Registrar para mim", description: "Guardar um registro pessoal revisavel.", mark: "memo", tone: "vault" }
];

export function RelatoPurposeStep({ value, onChange, onBack, onContinue }: RelatoPurposeStepProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="flex min-h-full flex-col">
      <button type="button" onClick={onBack} className="mb-8 flex w-fit items-center gap-2 text-sm text-muted transition hover:text-ink">
        <span>&lt;-</span>
        Voltar
      </button>

      <div className="mb-8 max-w-3xl">
        <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--color-lavender-deep))]">finalidade</p>
        <h1 className="mt-4 font-display text-4xl italic leading-tight text-ink lg:text-5xl">Como voce quer usar este material?</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          A finalidade muda a organizacao do relatorio, mantendo o texto revisavel e sem diagnostico.
        </p>
      </div>

      <div className="grid flex-1 gap-4 md:grid-cols-2">
        {purposes.map((purpose, index) => {
          const selected = value === purpose.id;
          return (
            <motion.button
              key={purpose.id}
              type="button"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index }}
              onClick={() => onChange(purpose.id)}
              className={`group relative min-h-[13rem] overflow-hidden rounded-[2rem] border p-6 text-left shadow-[0_16px_48px_rgba(103,43,66,0.055)] transition hover:-translate-y-0.5 ${selected ? "border-[rgba(103,43,66,0.28)] ring-2 ring-[rgba(184,101,118,0.22)]" : "border-[rgba(103,43,66,0.08)]"} ${toneClass(purpose.tone)}`}
            >
              <span className="absolute right-0 top-0 h-28 w-28 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/32 transition-transform duration-500 group-hover:scale-125" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/48 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-wine">
                  {purpose.mark}
                </span>
                <span>
                  <span className="block text-xl font-semibold text-ink">{purpose.label}</span>
                  <span className="mt-2 block text-sm leading-6 text-muted">{purpose.description}</span>
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-center">
        <button type="button" onClick={onContinue} disabled={!value} className="rounded-xl bg-[rgb(var(--color-wine))] px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-[rgba(103,43,66,0.9)] disabled:cursor-not-allowed disabled:opacity-45">
          Gerar relatorio demonstrativo
        </button>
      </div>
    </motion.div>
  );
}

function toneClass(tone: string) {
  if (tone === "rose") return "bg-[linear-gradient(135deg,rgba(255,251,246,0.82),rgba(231,176,184,0.22))]";
  if (tone === "lavender") return "bg-[linear-gradient(135deg,rgba(255,251,246,0.82),rgba(188,167,219,0.24))]";
  if (tone === "honey") return "bg-[linear-gradient(135deg,rgba(255,251,246,0.84),rgba(230,183,126,0.16))]";
  return "bg-[linear-gradient(135deg,rgba(255,251,246,0.84),rgba(45,33,43,0.08))]";
}
