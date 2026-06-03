import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-orbit border border-[rgba(103,43,66,0.12)] bg-[rgba(255,251,246,0.64)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-wine shadow-[0_10px_34px_rgba(103,43,66,0.08)] backdrop-blur-[var(--blur-glass)]",
        className
      )}
    >
      {children}
    </span>
  );
}
