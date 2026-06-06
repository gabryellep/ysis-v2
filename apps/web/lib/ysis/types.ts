export type RelatoPurpose = "gynecologist" | "psychologist" | "obstetrics" | "personal" | "sensitive_situation";

export type StructuredReportSectionItem = {
  label: string;
  value: string;
  sensitive: boolean;
  missing: boolean;
};

export type StructuredReportSection = {
  id: string;
  title: string;
  items: StructuredReportSectionItem[];
};

export type StructuredReportQuestion = {
  category: "observacao" | "contexto" | "rotina" | "consulta" | "registro" | "seguranca" | "emocional" | "limites" | "gestacao";
  text: string;
  why_it_may_help: string;
};

export type StructuredReport = {
  title: string;
  purpose: RelatoPurpose;
  report_type: "ginecologia" | "psicologia" | "obstetricia" | "registro_pessoal" | "situacao_sensivel" | "geral";
  audience: string;
  tone: string;
  period: string;
  summary: string;
  sections: StructuredReportSection[];
  suggested_questions: StructuredReportQuestion[];
  non_diagnostic_notice: string;
  fallback_message: string;
  missing_fields: Record<string, string>;
  share_text: string;
  provider: "mock" | "openai" | "local";
  provider_mode: "mock" | "real" | "local";
  persisted: false;
  review_required: true;
};
