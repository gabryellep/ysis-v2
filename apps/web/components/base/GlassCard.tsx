import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function GlassCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-silk border border-[rgba(103,43,66,0.12)] bg-[var(--surface-glass)] p-6 shadow-veil backdrop-blur-[var(--blur-glass)]",
        "before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)]",
        className
      )}
    >
      {children}
    </div>
  );
}
