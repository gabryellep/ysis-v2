"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { ysisMotion } from "@/lib/motion-config";

type AnimatedPhraseProps = {
  words: string[];
  className?: string;
};

export function AnimatedPhrase({ words, className }: AnimatedPhraseProps) {
  return (
    <span className={cn("inline-flex flex-wrap gap-x-3 gap-y-2", className)} aria-label={words.join(" ")}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block bg-[linear-gradient(120deg,rgb(var(--color-wine)),rgb(var(--color-rose)),rgb(var(--color-lavender-deep)))] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: ysisMotion.duration.slow, delay: index * 0.06, ease: ysisMotion.ease }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
