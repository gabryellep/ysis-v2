"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { WorkspaceView } from "@/lib/session/experience-state";

const logoSrc = "/lovable/ysis-logo.jpeg";

const items: Array<{ id: WorkspaceView; label: string }> = [
  { id: "home", label: "Inicio" },
  { id: "intake", label: "Relato" },
  { id: "history", label: "Historico" },
  { id: "report", label: "Relatorios" },
  { id: "conversation", label: "Conversa" },
  { id: "privacy", label: "Controle" }
];

export function MobileWorkspaceNav({ activeView, onNavigate, onNewIntake }: { activeView: WorkspaceView; onNavigate: (view: WorkspaceView) => void; onNewIntake: () => void }) {
  const [open, setOpen] = useState(false);

  function go(view: WorkspaceView) {
    if (view === "intake") onNewIntake();
    else onNavigate(view);
    setOpen(false);
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[rgba(103,43,66,0.08)] bg-[rgba(255,251,246,0.9)] backdrop-blur-[var(--blur-glass)] lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2" aria-label="Voltar para a landing page da Ysis">
            <img src={logoSrc} alt="Ysis" className="h-8 w-8 rounded-xl object-cover shadow-[0_8px_20px_rgba(103,43,66,0.12)]" />
            <span className="font-display text-xl italic text-ink">Ysis</span>
          </a>
          <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-xl bg-[rgba(188,167,219,0.2)] px-3 py-2 text-sm font-semibold text-[rgb(var(--color-lavender-deep))]">
            {open ? "Fechar" : "Menu"}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Fechar menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-ink/10 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 right-0 top-0 z-50 w-72 bg-[rgb(var(--color-paper))] p-4 pt-16 shadow-[0_20px_80px_rgba(103,43,66,0.18)] lg:hidden"
              aria-label="Menu mobile"
            >
              <div className="space-y-1">
                {items.map((item) => (
                  <button key={item.id} type="button" onClick={() => go(item.id)} className={activeView === item.id ? "flex w-full items-center gap-3 rounded-2xl bg-[rgba(188,167,219,0.28)] px-4 py-3 text-left text-sm font-semibold text-wine" : "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-muted hover:bg-[rgba(188,167,219,0.14)]"}>
                    <span className={activeView === item.id ? "h-2 w-2 rounded-full bg-[rgb(var(--color-wine))]" : "h-2 w-2 rounded-full bg-[rgba(119,99,112,0.24)]"} />
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[rgba(103,43,66,0.08)] bg-[rgba(255,251,246,0.94)] px-2 py-2 backdrop-blur-[var(--blur-glass)] lg:hidden" aria-label="Navegacao inferior">
        <div className="grid grid-cols-5 gap-1">
          {items.slice(0, 5).map((item) => (
            <button key={item.id} type="button" onClick={() => go(item.id)} className={activeView === item.id ? "rounded-2xl px-2 py-2 text-[0.68rem] font-semibold text-wine" : "rounded-2xl px-2 py-2 text-[0.68rem] font-semibold text-muted"}>
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
