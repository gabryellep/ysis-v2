"use client";

type DiscreetModeToggleProps = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

export function DiscreetModeToggle({ enabled, onChange }: DiscreetModeToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className="inline-flex items-center gap-2 rounded-full border border-[rgba(103,43,66,0.1)] bg-[rgb(var(--color-paper))] px-3 py-2 text-xs font-semibold text-muted shadow-[0_10px_30px_rgba(103,43,66,0.06)] transition hover:text-ink"
    >
      <span className={`flex h-5 w-9 items-center rounded-full p-0.5 transition ${enabled ? "bg-[rgb(var(--color-wine))]" : "bg-[rgba(103,43,66,0.16)]"}`}>
        <span className={`h-4 w-4 rounded-full bg-white transition ${enabled ? "translate-x-4" : "translate-x-0"}`} />
      </span>
      Modo discreto
    </button>
  );
}
