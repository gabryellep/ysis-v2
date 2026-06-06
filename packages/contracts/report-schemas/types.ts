export type YsisReportPurpose =
  | "consultation"
  | "symptoms"
  | "conversation"
  | "personal"
  | "gynecologist"
  | "psychologist"
  | "obstetrics"
  | "urgent_care"
  | "sensitive_situation";

export type YsisReportSectionItem = {
  label: string;
  value: string;
  sensitive: boolean;
  missing: boolean;
};

export type YsisReportSection = {
  id: string;
  title: string;
  items: YsisReportSectionItem[];
};

export type YsisSuggestedQuestion = {
  category: "observacao" | "contexto" | "rotina" | "consulta" | "registro" | "seguranca" | "emocional" | "limites" | "gestacao";
  text: string;
  why_it_may_help: string;
};

export type YsisStructuredReport = {
  title: string;
  purpose: YsisReportPurpose;
  report_type: "ginecologia" | "psicologia" | "obstetricia" | "registro_pessoal" | "situacao_sensivel" | "geral";
  audience: string;
  tone: string;
  period: string;
  source_record_ids: string[];
  summary: string;
  sections: YsisReportSection[];
  suggested_questions: YsisSuggestedQuestion[];
  non_diagnostic_notice: string;
  fallback_message: string;
  safety_warnings: unknown[];
  missing_fields: Record<string, string>;
  share_text: string;
  provider: "mock" | "openai" | "local";
  provider_mode: "mock" | "real" | "local";
  persisted: false;
  review_required: true;
};
