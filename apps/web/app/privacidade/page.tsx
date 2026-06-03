import { GlassCard } from "@/components/base/GlassCard";
import { SectionContainer } from "@/components/base/SectionContainer";
import { Tag } from "@/components/base/Tag";
import { PageShell } from "@/components/layout/PageShell";
import { SafetyNotice } from "@/components/safety/SafetyNotice";

export default function PrivacidadePage() {
  return (
    <PageShell>
      <SectionContainer className="max-w-4xl">
        <Tag>Privacidade</Tag>
        <h1 className="mt-6 font-display text-5xl leading-tight text-ink">Voce decide o que fica.</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <GlassCard>
            <p className="text-sm font-semibold text-wine">Base LGPD</p>
            <p className="mt-3 text-sm leading-6 text-muted">
              Historico opcional, dados minimizados, consentimento claro e nenhum envio automatico para terceiros.
            </p>
          </GlassCard>
          <SafetyNotice />
        </div>
      </SectionContainer>
    </PageShell>
  );
}
