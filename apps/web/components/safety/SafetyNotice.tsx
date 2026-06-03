import { GlassCard } from "@/components/base/GlassCard";

export function SafetyNotice() {
  return (
    <GlassCard className="p-5">
      <p className="text-sm font-semibold text-wine">Aviso de cuidado</p>
      <p className="mt-2 text-sm leading-6 text-muted">
        A Ysis organiza relatos para apoiar conversas com profissionais. Ela nao realiza diagnostico, nao prescreve e nao substitui atendimento medico, psicologico ou juridico.
      </p>
    </GlassCard>
  );
}
