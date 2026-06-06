"use client";

import { motion } from "framer-motion";
import type { WorkspaceView } from "@/lib/session/experience-state";

type HomeFerramentaProps = {
  onNewIntake: () => void;
  onNavigate: (view: WorkspaceView) => void;
};

const quickActions: Array<{ id: WorkspaceView; label: string; description: string; mark: string; tone: string }> = [
  { id: "history", label: "Historico", description: "Seus relatos anteriores", mark: "linha", tone: "rose" },
  { id: "report", label: "Relatorios", description: "Documentos revisaveis", mark: "doc", tone: "lavender" },
  { id: "conversation", label: "Conversa", description: "Prepare seu atendimento", mark: "kit", tone: "honey" },
  { id: "privacy", label: "Privacidade", description: "Suas configuracoes", mark: "cofre", tone: "vault" }
];

const floatingWords = [
  { text: "clareza", className: "left-[3%] top-[18%] text-3xl text-[rgba(103,43,66,0.13)]" },
  { text: "cuidado", className: "right-[4%] top-[7%] text-5xl text-[rgba(129,94,158,0.12)]" },
  { text: "ritmo", className: "right-[13%] bottom-[20%] text-4xl text-[rgba(184,101,118,0.12)]" },
  { text: "voz", className: "left-[10%] bottom-[11%] text-2xl text-[rgba(129,94,158,0.14)]" }
];

export function HomeFerramenta({ onNewIntake, onNavigate }: HomeFerramentaProps) {
  return (
    <div className="relative min-h-full overflow-hidden rounded-[2.7rem] bg-[radial-gradient(circle_at_88%_10%,rgba(188,167,219,0.34),transparent_28%),radial-gradient(circle_at_8%_84%,rgba(231,176,184,0.34),transparent_32%),linear-gradient(145deg,rgba(255,251,246,0.96),rgba(255,248,242,0.9)_42%,rgba(250,244,238,0.94))] px-5 py-6 shadow-[0_28px_90px_rgba(103,43,66,0.055)] sm:px-8 lg:px-10 lg:py-9">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div animate={{ rotate: 360, y: [0, -12, 0] }} transition={{ rotate: { duration: 32, repeat: Infinity, ease: "linear" }, y: { duration: 7, repeat: Infinity, ease: "easeInOut" } }} className="absolute -right-20 top-14 h-72 w-72 rounded-[38%] bg-[radial-gradient(circle,rgba(188,167,219,0.42),transparent_66%)] blur-sm" />
        <motion.div animate={{ rotate: -360, x: [0, 14, 0] }} transition={{ rotate: { duration: 38, repeat: Infinity, ease: "linear" }, x: { duration: 8, repeat: Infinity, ease: "easeInOut" } }} className="absolute -left-16 bottom-12 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(231,176,184,0.34),transparent_68%)]" />
        <motion.div animate={{ y: [0, -18, 0], rotate: [-8, 4, -8] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute right-[23%] top-[34%] h-28 w-48 rounded-full border border-white/60 bg-[rgba(224,215,255,0.22)] shadow-[0_24px_80px_rgba(129,94,158,0.13)] backdrop-blur-[18px]" />
        <motion.div animate={{ y: [0, 14, 0], rotate: [7, -6, 7] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} className="absolute left-[26%] bottom-[15%] h-24 w-36 rounded-[2rem] border border-white/64 bg-[rgba(249,235,234,0.42)] shadow-[0_18px_60px_rgba(184,101,118,0.11)] backdrop-blur-[18px]" />
        {floatingWords.map((word, index) => (
          <motion.span
            key={word.text}
            animate={{ opacity: [0.2, 0.64, 0.2], y: [0, -10, 0] }}
            transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut", delay: index * 0.7 }}
            className={`absolute font-display italic ${word.className}`}
          >
            {word.text}
          </motion.span>
        ))}
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-9rem)] flex-col">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 max-w-5xl">
          <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[rgb(var(--color-lavender-deep))]">Meu espaco Ysis</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[0.98] text-ink lg:text-6xl">
            Por onde voce deseja <span className="font-display italic text-wine">comecar hoje?</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted lg:text-base">Escolha um caminho. A Ysis acompanha seu relato com privacidade, ritmo e revisao antes de qualquer uso.</p>
        </motion.div>

        <div className="grid flex-1 gap-5 xl:grid-cols-[minmax(0,1.35fr)_0.65fr]">
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 22, rotateX: -4 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            onClick={onNewIntake}
            className="group relative min-h-[26rem] overflow-hidden rounded-[2.35rem] bg-[radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.52),transparent_24%),linear-gradient(135deg,rgba(255,251,246,0.92),rgba(231,176,184,0.56)_38%,rgba(188,167,219,0.4)_100%)] p-6 text-left shadow-[inset_0_0_0_1px_rgba(255,255,255,0.72),0_32px_90px_rgba(184,101,118,0.18)] transition hover:-translate-y-1 lg:p-8"
          >
            <motion.div aria-hidden animate={{ rotate: 360 }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }} className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.46),transparent_64%)]" />
            <motion.div aria-hidden animate={{ y: [0, -14, 0], rotate: [-4, 8, -4] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-8 right-10 h-32 w-56 rounded-full bg-white/20 shadow-[0_18px_70px_rgba(129,94,158,0.14)] backdrop-blur-[18px]" />
            <motion.div aria-hidden animate={{ rotate: [-7, 5, -7], y: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute right-12 top-28 hidden h-52 w-40 rounded-[2rem] border border-white/64 bg-[rgba(255,251,246,0.34)] p-4 shadow-[0_22px_70px_rgba(103,43,66,0.12)] backdrop-blur-[18px] lg:block">
              <span className="block font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-wine">relato</span>
              <span className="mt-8 block h-2 rounded-full bg-[rgba(103,43,66,0.18)]" />
              <span className="mt-3 block h-2 w-4/5 rounded-full bg-[rgba(129,94,158,0.28)]" />
              <span className="mt-3 block h-2 w-2/3 rounded-full bg-[rgba(184,101,118,0.24)]" />
            </motion.div>
            <motion.div aria-hidden animate={{ x: [0, 10, 0], opacity: [0.78, 1, 0.78] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-20 left-8 hidden h-20 w-64 items-center justify-center gap-1 rounded-full bg-[rgba(224,215,255,0.3)] shadow-[0_18px_60px_rgba(129,94,158,0.13)] backdrop-blur-[18px] lg:flex">
              {[18, 34, 24, 44, 30, 22, 38, 26].map((height, index) => (
                <motion.span key={index} animate={{ height: [height, height + 12, height] }} transition={{ duration: 1.4, repeat: Infinity, delay: index * 0.08 }} className="w-1.5 rounded-full bg-[linear-gradient(180deg,rgb(var(--color-lavender)),rgb(var(--color-lavender-deep)))]" />
              ))}
            </motion.div>
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="max-w-[34rem]">
                <div className="mb-8 flex items-start justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/52 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-wine backdrop-blur-sm">rel</span>
                  <span className="rounded-full bg-white/38 px-4 py-2 text-sm font-semibold text-wine transition-transform group-hover:translate-x-1">entrar</span>
                </div>
                <h2 className="max-w-2xl text-3xl font-semibold leading-tight text-ink lg:text-5xl">Comecar novo relato</h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-muted lg:text-base">Escreva ou fale sobre o que voce esta sentindo. Sem pressa, sem julgamento, com controle do que fica salvo.</p>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/42 px-3 py-1.5 text-xs text-muted backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--color-rose))]" />
                  Rascunho salvo localmente
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(188,167,219,0.22)] px-3 py-1.5 text-xs text-[rgb(var(--color-lavender-deep))] backdrop-blur-sm">
                  voz e escrita
                </span>
              </div>
            </div>
          </motion.button>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.id}
                type="button"
                initial={{ opacity: 0, x: 20, rotate: index % 2 ? 1.5 : -1.5 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ duration: 0.45, delay: 0.16 + index * 0.06 }}
                whileHover={{ y: -4, rotate: index % 2 ? -0.6 : 0.6 }}
                onClick={() => onNavigate(action.id)}
                className={`group relative min-h-[8.2rem] overflow-hidden rounded-[1.7rem] border border-white/64 p-4 text-left shadow-[0_14px_42px_rgba(103,43,66,0.055)] backdrop-blur-[var(--blur-glass)] ${toneClass(action.tone)}`}
              >
                <span className="absolute right-0 top-0 h-20 w-20 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/28 transition-transform duration-500 group-hover:scale-150" />
                <span className="absolute bottom-3 right-4 h-px w-16 bg-[linear-gradient(90deg,transparent,rgba(103,43,66,0.22))]" />
                <div className="relative z-10 flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/48 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-[rgb(var(--color-lavender-deep))]">
                    {action.mark}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{action.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-muted">{action.description}</span>
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="pt-6">
          <button type="button" onClick={() => onNavigate("privacy")} className="mx-auto flex items-center justify-center gap-2 text-xs text-muted transition hover:text-wine">
            <span className="h-2 w-2 rounded-full bg-[rgb(var(--color-lavender))]" />
            Modo discreto - dados sob seu controle
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function toneClass(tone: string) {
  if (tone === "rose") return "bg-[linear-gradient(135deg,rgba(255,251,246,0.76),rgba(231,176,184,0.22))]";
  if (tone === "lavender") return "bg-[linear-gradient(135deg,rgba(255,251,246,0.76),rgba(188,167,219,0.22))]";
  if (tone === "honey") return "bg-[linear-gradient(135deg,rgba(255,251,246,0.78),rgba(230,183,126,0.16))]";
  return "bg-[linear-gradient(135deg,rgba(255,251,246,0.78),rgba(45,33,43,0.08))]";
}
