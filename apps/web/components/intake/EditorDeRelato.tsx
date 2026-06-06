"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { RelatoDraft } from "@/lib/session/experience-state";

type EditorDeRelatoProps = {
  draft: RelatoDraft;
  onChange: (draft: Partial<RelatoDraft>) => void;
  onClear: () => void;
  onBack: () => void;
  onReview: () => void;
  onPreferVoice: () => void;
};

const suggestions = ["Descreva quando comecou", "Como esta afetando seu dia", "O que ja tentou fazer"];

export function EditorDeRelato({ draft, onChange, onClear, onBack, onReview, onPreferVoice }: EditorDeRelatoProps) {
  const [showSuggestions, setShowSuggestions] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const charCount = draft.text.length;
  const wordCount = draft.text.trim() ? draft.text.trim().split(/\s+/).length : 0;

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  function updateText(text: string) {
    onChange({ text });
    if (text.length > 20) setShowSuggestions(false);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="flex min-h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm text-muted transition hover:text-ink">
          <span>&lt;-</span>
          Voltar
        </button>
        <div className="font-mono text-xs text-muted">{wordCount > 0 ? `${wordCount} palavras` : "rascunho local"}</div>
      </div>

      <div className="relative flex-1">
        <div className="h-full rounded-[2rem] border border-[rgba(103,43,66,0.08)] bg-[rgb(var(--color-paper))] p-6 shadow-[0_16px_48px_rgba(103,43,66,0.055)] lg:p-9">
          <textarea
            ref={textareaRef}
            value={draft.text}
            onChange={(event) => updateText(event.target.value)}
            aria-label="Relato privado"
            className="h-full min-h-[360px] w-full resize-none bg-transparent text-base leading-8 text-ink outline-none lg:min-h-[470px] lg:text-lg"
          />
          {!draft.text ? (
            <p className="pointer-events-none absolute left-6 top-6 max-w-xl text-base leading-8 text-muted/50 lg:left-9 lg:top-9 lg:text-lg">
              Conte o que esta sentindo ou vivenciando...
            </p>
          ) : null}
        </div>

        {showSuggestions && draft.text.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-6 left-6 right-6 lg:left-9 lg:right-9">
            <div className="mb-3 flex items-center gap-2 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--color-lavender-deep))]" />
              Sugestoes para comecar
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button key={suggestion} type="button" onClick={() => updateText(`${suggestion} `)} className="rounded-full bg-[rgba(188,167,219,0.2)] px-3 py-1.5 text-xs text-[rgb(var(--color-lavender-deep))] transition hover:bg-[rgba(188,167,219,0.34)]">
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6">
        <div className="mx-auto flex max-w-fit items-center justify-center gap-2 rounded-2xl border border-[rgba(103,43,66,0.08)] bg-[rgb(var(--color-paper))] p-2 shadow-[0_16px_48px_rgba(103,43,66,0.1)]">
          <button type="button" onClick={onPreferVoice} className="rounded-xl px-4 py-2.5 text-sm text-muted transition hover:bg-[rgba(188,167,219,0.2)] hover:text-[rgb(var(--color-lavender-deep))]">Falar</button>
          {draft.text.length > 0 ? (
            <>
              <div className="h-6 w-px bg-[rgba(103,43,66,0.12)]" />
              <button type="button" onClick={onClear} className="rounded-xl px-4 py-2.5 text-sm text-muted transition hover:bg-[rgba(231,176,184,0.16)] hover:text-wine">Apagar</button>
              <div className="h-6 w-px bg-[rgba(103,43,66,0.12)]" />
              <button type="button" onClick={onReview} className="rounded-xl bg-[rgb(var(--color-wine))] px-4 py-2.5 text-sm font-semibold text-paper transition hover:bg-[rgba(103,43,66,0.9)]">Revisar</button>
            </>
          ) : null}
        </div>
      </motion.div>

      {charCount > 0 ? <div className="mt-4 text-center text-xs text-muted">{charCount} caracteres</div> : null}
    </motion.div>
  );
}
