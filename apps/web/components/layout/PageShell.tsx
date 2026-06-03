import type { ReactNode } from "react";
import { Button } from "@/components/base/Button";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
        <a href="/" className="text-lg font-semibold text-wine">
          Ysis
        </a>
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <a href="/ferramenta">Ferramenta</a>
          <a href="/historico">Historico</a>
          <a href="/privacidade">Privacidade</a>
        </nav>
        <Button href="/ferramenta" tone="secondary" className="min-h-10 px-4">
          Comecar
        </Button>
      </header>
      <main>{children}</main>
    </div>
  );
}
