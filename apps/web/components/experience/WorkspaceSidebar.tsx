import type { WorkspaceView } from "@/lib/session/experience-state";

const logoSrc = "/lovable/ysis-logo.jpeg";

const navItems: Array<{ id: WorkspaceView; label: string; mark: string; icon: IconName }> = [
  { id: "home", label: "Inicio", mark: "01", icon: "home" },
  { id: "intake", label: "Novo relato", mark: "02", icon: "plus" },
  { id: "history", label: "Historico", mark: "03", icon: "clock" },
  { id: "report", label: "Relatorios", mark: "04", icon: "document" },
  { id: "conversation", label: "Conversa", mark: "05", icon: "conversation" },
  { id: "privacy", label: "Privacidade", mark: "06", icon: "shield" }
];

type WorkspaceSidebarProps = {
  activeView: WorkspaceView;
  onNavigate: (view: WorkspaceView) => void;
  onNewIntake: () => void;
};

export function WorkspaceSidebar({ activeView, onNavigate, onNewIntake }: WorkspaceSidebarProps) {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-[rgba(103,43,66,0.08)] bg-[rgba(255,251,246,0.8)] shadow-[12px_0_44px_rgba(103,43,66,0.035)] backdrop-blur-[var(--blur-glass)] lg:flex">
      <a href="/" className="mx-5 mt-6 flex items-center gap-3 rounded-[1.6rem] border border-[rgba(103,43,66,0.08)] bg-white/42 p-3 text-left shadow-[0_14px_36px_rgba(103,43,66,0.045)] transition hover:bg-white/58" aria-label="Voltar para a landing page da Ysis">
        <img src={logoSrc} alt="Ysis" className="h-12 w-12 rounded-2xl object-cover shadow-[0_10px_28px_rgba(103,43,66,0.12)]" />
        <span>
          <span className="block font-display text-2xl italic leading-none text-ink">Ysis</span>
          <span className="mt-1 block text-xs leading-4 text-muted">cuidado intimo, no seu ritmo</span>
        </span>
      </a>

      <button type="button" onClick={onNewIntake} className="mx-4 mt-7 overflow-hidden rounded-[1.45rem] bg-[linear-gradient(135deg,rgb(var(--color-rose)),rgb(var(--color-wine)))] px-4 py-4 text-left text-paper shadow-[0_16px_42px_rgba(184,101,118,0.18)] transition hover:-translate-y-0.5">
        <span className="block text-sm font-semibold">Comecar novo relato</span>
        <span className="mt-1 block text-xs text-paper/72">escrever ou falar</span>
      </button>

      <nav className="mt-7 flex-1 px-3" aria-label="Navegacao da ferramenta">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => (item.id === "intake" ? onNewIntake() : onNavigate(item.id))}
                  className={isActive ? "group relative flex w-full items-center gap-3 rounded-2xl bg-white/62 px-3.5 py-3 text-left text-[rgb(var(--color-lavender-deep))] shadow-[0_10px_30px_rgba(129,94,158,0.07)] transition" : "group relative flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-muted transition hover:bg-white/44 hover:text-ink"}
                >
                  <span className={isActive ? "flex h-9 w-9 items-center justify-center rounded-2xl bg-[rgba(188,167,219,0.28)] text-[rgb(var(--color-lavender-deep))]" : "flex h-9 w-9 items-center justify-center rounded-2xl bg-white/36 text-muted group-hover:bg-[rgba(188,167,219,0.16)] group-hover:text-[rgb(var(--color-lavender-deep))]"}>
                    <NavIcon name={item.icon} />
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="ml-auto font-mono text-[0.58rem] tracking-[0.16em] opacity-50">{item.mark}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mx-4 mb-5 rounded-3xl bg-[rgba(188,167,219,0.18)] p-4">
        <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--color-lavender-deep))]">Modo seguro</p>
        <p className="mt-2 text-xs leading-5 text-muted">Seus dados ficam sob seu controle.</p>
      </div>
    </aside>
  );
}

type IconName = "home" | "plus" | "clock" | "document" | "conversation" | "shield";

function NavIcon({ name }: { name: IconName }) {
  if (name === "home") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4.5 11.5 12 5l7.5 6.5" />
        <path d="M7 10.5V19h10v-8.5" />
        <path d="M10 19v-5h4v5" />
      </svg>
    );
  }
  if (name === "plus") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="5" y="5" width="14" height="14" rx="4" />
        <path d="M12 8.5v7M8.5 12h7" />
      </svg>
    );
  }
  if (name === "clock") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 7v5l3 2" />
        <path d="M5 8a8 8 0 1 1-.5 7.2" />
        <path d="M3.5 8H7V4.5" />
      </svg>
    );
  }
  if (name === "document") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M8 4.5h6l3 3V19.5H8z" />
        <path d="M14 4.5V8h3" />
        <path d="M10 12h5M10 15h4" />
      </svg>
    );
  }
  if (name === "conversation") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 8.5h10M7 12h6" />
        <path d="M5 5h14v10H9l-4 4z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 4.5 18 7v5.2c0 3.5-2.3 5.8-6 7.3-3.7-1.5-6-3.8-6-7.3V7z" />
      <path d="m9.5 12 1.7 1.7 3.6-4" />
    </svg>
  );
}
