import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonTone = "primary" | "secondary";

type ButtonBaseProps = {
  children: ReactNode;
  tone?: ButtonTone;
  className?: string;
};

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const tones: Record<ButtonTone, string> = {
  primary:
    "bg-wine text-paper shadow-glow before:absolute before:inset-0 before:rounded-orbit before:bg-[linear-gradient(120deg,rgba(255,255,255,0.26),transparent_44%,rgba(231,176,184,0.2))] before:opacity-80",
  secondary:
    "border border-[rgba(103,43,66,0.16)] bg-[rgba(255,251,246,0.58)] text-wine shadow-veil backdrop-blur-[var(--blur-glass)]"
};

export function Button({ children, tone = "primary", className, href, ...props }: ButtonProps) {
  const buttonClassName = cn(
    "relative inline-flex min-h-12 items-center justify-center overflow-hidden rounded-orbit px-6 text-sm font-semibold transition duration-base ease-ysis hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose",
    tones[tone],
    className
  );

  if (href) {
    return (
      <Link href={href} className={buttonClassName} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        <span className="relative z-10">{children}</span>
      </Link>
    );
  }

  return (
    <button className={buttonClassName} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      <span className="relative z-10">{children}</span>
    </button>
  );
}
