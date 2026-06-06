"use client";

import type { RelatoDraft } from "@/lib/session/experience-state";
import { consentItems, type ConsentKey } from "@/lib/ysis/privacy";

type ConsentChecklistProps = {
  consent: RelatoDraft["consent"];
  onChange: (key: ConsentKey, value: boolean) => void;
};

export function ConsentChecklist({ consent, onChange }: ConsentChecklistProps) {
  return (
    <div className="space-y-3">
      {consentItems.map((item) => (
        <label key={item.key} className="flex gap-3 rounded-2xl border border-[rgba(103,43,66,0.08)] bg-white/50 p-4 text-sm leading-6 text-muted">
          <input
            type="checkbox"
            checked={consent[item.key]}
            onChange={(event) => onChange(item.key, event.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-[rgb(var(--color-wine))]"
          />
          <span>{item.label}</span>
        </label>
      ))}
    </div>
  );
}
