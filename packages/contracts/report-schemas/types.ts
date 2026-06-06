export type YsisReportPurpose =
  | "consultation"
  | "symptoms"
  | "conversation"
  | "personal"
  | "gynecologist"
  | "psychologist"
  | "urgent_care"
  | "sensitive_situation";

export type YsisReportSectionItem = {
  label: string;
  value: string;
  sensitive: boolean;
};

export type YsisReportSection = {
  id: string;
  title: string;
  items: YsisReportSectionItem[];
};

export type YsisSuggestedQuestion = {
  category: "observacao" | "contexto" | "rotina" | "consulta" | "registro" | "seguranca";
  text: string;
  why_it_may_help: string;
};

export type YsisStructuredReport = {
  title: string;
  purpose: YsisReportPurpose;
  period: string;
  source_record_ids: string[];
  summary: string;
  sections: YsisReportSection[];
  suggested_questions: YsisSuggestedQuestion[];
  safety_warnings: unknown[];
  missing_fields: Record<string, string>;
  share_text: string;
};
