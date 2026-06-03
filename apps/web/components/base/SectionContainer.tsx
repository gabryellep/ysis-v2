import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionContainerProps = {
  children: ReactNode;
  className?: string;
  tone?: "open" | "veil";
};

export function SectionContainer({ children, className, tone = "open" }: SectionContainerProps) {
  return (
    <section
      className={cn(
        "relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24",
        tone === "veil" &&
          "rounded-[2rem] border border-[rgba(103,43,66,0.1)] bg-[rgba(255,251,246,0.42)] shadow-veil backdrop-blur-[var(--blur-glass)]",
        className
      )}
    >
      {children}
    </section>
  );
}
