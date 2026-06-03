import { Button } from "@/components/base/Button";
import { GlassCard } from "@/components/base/GlassCard";
import { SectionContainer } from "@/components/base/SectionContainer";
import { Tag } from "@/components/base/Tag";
import { PageShell } from "@/components/layout/PageShell";
import { SafetyNotice } from "@/components/safety/SafetyNotice";

export default function FerramentaPage() {
  return (
    <PageShell>
      <SectionContainer className="max-w-5xl">
        <Tag>Ferramenta interna</Tag>
        <h1 className="mt-6 font-display text-5xl leading-tight text-ink">Conte do seu jeito.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
          Placeholder da ferramenta. O fluxo de texto, voz, revisao, relatorios e perguntas sugeridas sera implementado depois.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-[1fr_0.72fr]">
          <GlassCard>
            <p className="text-sm font-semibold text-wine">Area futura de relato</p>
            <div className="mt-5 min-h-44 rounded-silk border border-dashed border-[rgba(103,43,66,0.18)] bg-[rgba(255,251,246,0.42)]" />
            <div className="mt-5 flex flex-wrap gap-3">
              <Button>Escrever</Button>
              <Button tone="secondary">Falar depois</Button>
            </div>
          </GlassCard>
          <SafetyNotice />
        </div>
      </SectionContainer>
    </PageShell>
  );
}
