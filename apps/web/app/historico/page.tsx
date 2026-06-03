import { GlassCard } from "@/components/base/GlassCard";
import { SectionContainer } from "@/components/base/SectionContainer";
import { Tag } from "@/components/base/Tag";
import { PageShell } from "@/components/layout/PageShell";

export default function HistoricoPage() {
  return (
    <PageShell>
      <SectionContainer className="max-w-4xl">
        <Tag>Historico opcional</Tag>
        <h1 className="mt-6 font-display text-5xl leading-tight text-ink">Registros sob seu controle.</h1>
        <GlassCard className="mt-8">
          <p className="text-muted">
            Placeholder do historico. A proxima etapa deve preservar escolha da usuaria, titulos neutros, modo discreto, exportacao e exclusao.
          </p>
        </GlassCard>
      </SectionContainer>
    </PageShell>
  );
}
