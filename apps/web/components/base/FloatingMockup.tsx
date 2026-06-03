"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ysisMotion } from "@/lib/motion-config";

export function FloatingMockup({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <motion.div
      className={cn(
        "relative min-h-[22rem] overflow-hidden rounded-[2rem] border border-[rgba(103,43,66,0.14)] bg-[rgba(255,251,246,0.7)] p-5 shadow-bloom backdrop-blur-[var(--blur-glass)]",
        className
      )}
      animate={ysisMotion.float}
      transition={ysisMotion.floatTransition}
    >
      <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-lavender/30 blur-3xl" />
      <div className="absolute -bottom-20 left-8 h-48 w-48 rounded-full bg-rose/20 blur-3xl" />
      <div className="relative z-10 h-full rounded-[1.5rem] border border-[rgba(103,43,66,0.1)] bg-[rgba(255,251,246,0.72)] p-5">
        {children ?? (
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="mb-5 h-2 w-24 rounded-orbit bg-rose/30" />
              <div className="space-y-3">
                <div className="h-4 w-3/4 rounded-orbit bg-wine/14" />
                <div className="h-4 w-2/3 rounded-orbit bg-wine/10" />
                <div className="h-20 rounded-soft bg-lavender/18" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="h-16 rounded-soft bg-rose/18" />
              <div className="h-16 rounded-soft bg-lavender/18" />
              <div className="h-16 rounded-soft bg-ember/16" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
