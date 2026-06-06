"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { HomeFerramenta } from "@/components/experience/HomeFerramenta";
import { MesaDeRelato } from "@/components/experience/MesaDeRelato";
import { MobileWorkspaceNav } from "@/components/experience/MobileWorkspaceNav";
import { WorkspaceSidebar } from "@/components/experience/WorkspaceSidebar";
import { initialRelatoDraft, type MesaMode, type RelatoDraft, type WorkspaceView } from "@/lib/session/experience-state";

export function YsisExperienceShell() {
  const [activeView, setActiveView] = useState<WorkspaceView>("home");
  const [mesaMode, setMesaMode] = useState<MesaMode>("rest");
  const [relatoDraft, setRelatoDraft] = useState<RelatoDraft>(initialRelatoDraft);

  function openIntake() {
    setActiveView("intake");
    setMesaMode("rest");
  }

  function updateRelatoDraft(nextDraft: Partial<RelatoDraft>) {
    setRelatoDraft((current) => ({ ...current, ...nextDraft }));
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-canvas))] text-ink">
      <WorkspaceSidebar activeView={activeView} onNavigate={setActiveView} onNewIntake={openIntake} />
      <MobileWorkspaceNav activeView={activeView} onNavigate={setActiveView} onNewIntake={openIntake} />

      <main className="min-h-screen lg:ml-64">
        <div className="mx-auto min-h-screen max-w-6xl px-4 pb-24 pt-20 lg:px-10 lg:py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeView}-${activeView === "intake" ? mesaMode : "view"}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="min-h-[calc(100vh-7rem)] lg:min-h-[calc(100vh-5rem)]"
            >
              {activeView === "home" ? <HomeFerramenta onNavigate={setActiveView} onNewIntake={openIntake} /> : null}
              {activeView === "intake" ? (
                <MesaDeRelato
                  mode={mesaMode}
                  draft={relatoDraft}
                  onDraftChange={updateRelatoDraft}
                  onModeChange={setMesaMode}
                  onNewIntake={() => setMesaMode("writing")}
                  onNavigate={setActiveView}
                />
              ) : null}
              {activeView !== "home" && activeView !== "intake" ? <DeferredModule view={activeView} onNewIntake={openIntake} /> : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function DeferredModule({ view, onNewIntake }: { view: WorkspaceView; onNewIntake: () => void }) {
  const content = getModuleContent(view);

  return (
    <section className={`relative min-h-full overflow-hidden rounded-[2.6rem] p-5 shadow-[0_28px_90px_rgba(103,43,66,0.06)] lg:p-8 ${content.surface}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360, y: [0, -10, 0] }}
          transition={{ rotate: { duration: content.spin, repeat: Infinity, ease: "linear" }, y: { duration: 7, repeat: Infinity, ease: "easeInOut" } }}
          className={`absolute -right-16 top-8 h-72 w-72 rounded-[42%] ${content.orb}`}
        />
        <motion.div
          animate={{ rotate: [-8, 8, -8], x: [0, 12, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-8 h-28 w-52 rounded-full border border-white/60 bg-white/16 shadow-[0_20px_70px_rgba(103,43,66,0.08)] backdrop-blur-[18px]"
        />
        <motion.span
          animate={{ opacity: [0.16, 0.48, 0.16], y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[18%] right-[8%] font-display text-6xl italic text-ink/10"
        >
          {content.floatWord}
        </motion.span>
      </div>

      <div className="relative z-10 grid min-h-[calc(100vh-9rem)] gap-6 xl:grid-cols-[0.85fr_1.15fr] xl:items-stretch">
        <div className="flex flex-col justify-between">
          <div>
            <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">{content.kicker}</p>
            <h1 className="mt-4 max-w-xl font-display text-4xl italic leading-tight text-ink lg:text-6xl">{content.title}</h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-muted">{content.text}</p>
          </div>
          <button type="button" onClick={onNewIntake} className="mt-8 w-fit rounded-full bg-[linear-gradient(135deg,rgb(var(--color-rose)),rgb(var(--color-wine)))] px-5 py-3 text-sm font-semibold text-paper shadow-[0_14px_34px_rgba(184,101,118,0.18)] transition hover:-translate-y-0.5">
            Comecar novo relato
          </button>
        </div>

        <div className={`relative overflow-hidden rounded-[2.2rem] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.66),0_18px_58px_rgba(103,43,66,0.055)] ${content.panel}`}>
          <div className="absolute left-8 top-0 h-full w-px bg-[linear-gradient(180deg,transparent,rgba(103,43,66,0.16),transparent)]" />
          <div className="ml-9 space-y-6">
            {content.lines.map((line, index) => (
              <motion.div key={line} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }} className="relative">
                <span className={`absolute -left-[3rem] top-0 flex h-8 w-8 items-center justify-center rounded-full font-mono text-[0.58rem] font-semibold ${content.dot}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className={view === "privacy" ? "text-base leading-7 text-paper" : "text-base leading-7 text-ink"}>{line}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function getModuleContent(view: WorkspaceView) {
  if (view === "history") {
    return {
      kicker: "continuidade local",
      title: "Historico",
      text: "Uma linha sensivel para retomar registros sem transformar seu cuidado em painel.",
      lines: ["Rascunho salvo localmente.", "Relato revisado para conversa.", "Registro pessoal sob seu controle."],
      surface: "bg-[linear-gradient(135deg,rgba(255,251,246,0.94),rgba(231,176,184,0.2))]",
      panel: "bg-white/42",
      orb: "bg-[radial-gradient(circle,rgba(231,176,184,0.34),transparent_66%)]",
      dot: "bg-[rgba(231,176,184,0.32)] text-wine",
      floatWord: "tempo",
      spin: 34
    };
  }
  if (view === "report") {
    return {
      kicker: "documento vivo",
      title: "Relatorios",
      text: "Documentos claros para revisar, copiar ou baixar quando voce decidir usar.",
      lines: ["Sintese revisavel.", "Linha do tempo.", "Perguntas para levar."],
      surface: "bg-[linear-gradient(135deg,rgba(255,251,246,0.94),rgba(188,167,219,0.2))]",
      panel: "bg-white/42",
      orb: "bg-[radial-gradient(circle,rgba(188,167,219,0.36),transparent_66%)]",
      dot: "bg-[rgba(188,167,219,0.34)] text-[rgb(var(--color-lavender-deep))]",
      floatWord: "doc",
      spin: 38
    };
  }
  if (view === "conversation") {
    return {
      kicker: "kit de conversa",
      title: "Preparar conversa",
      text: "Frases e perguntas organizadas para voce chegar com mais clareza.",
      lines: ["O que quero contar.", "Perguntas que preciso fazer.", "Limites que quero respeitar."],
      surface: "bg-[linear-gradient(135deg,rgba(255,251,246,0.94),rgba(230,183,126,0.16),rgba(188,167,219,0.14))]",
      panel: "bg-white/44",
      orb: "bg-[radial-gradient(circle,rgba(230,183,126,0.28),transparent_66%)]",
      dot: "bg-[rgba(230,183,126,0.28)] text-wine",
      floatWord: "fala",
      spin: 42
    };
  }
  return {
    kicker: "controle",
    title: "Privacidade",
    text: "Dados locais, modo discreto e escolhas de salvar, copiar ou apagar continuam visiveis.",
    lines: ["Nada enviado automaticamente.", "Audio nao salvo por padrao.", "Voce revisa antes de usar."],
    surface: "bg-[linear-gradient(135deg,rgba(255,251,246,0.92),rgba(45,33,43,0.08))]",
    panel: "bg-[rgba(45,33,43,0.9)]",
    orb: "bg-[radial-gradient(circle,rgba(45,33,43,0.2),transparent_66%)]",
    dot: "bg-[rgba(255,251,246,0.18)] text-paper",
    floatWord: "cofre",
    spin: 46
  };
}
