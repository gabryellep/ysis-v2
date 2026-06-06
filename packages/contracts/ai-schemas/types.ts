export type YsisAiEndpoint =
  | "organizar-relato"
  | "gerar-relatorio"
  | "preparar-conversa"
  | "safe-fallback";

export type YsisConsentEvidence = {
  granted: true;
  text_version: string;
  granted_at: string;
  scopes: string[];
};

export type YsisClientContext = {
  mode: "guest" | "account";
  discreet_mode: boolean;
  source_screen: "ferramenta" | string;
  session_id?: string | null;
};

export type YsisSafetyWarning = {
  code: string;
  message: string;
  severity: "info" | "attention" | "blocked";
  source: "input" | "output" | "system";
};

export type YsisApiEnvelope<TResult> = {
  ok: boolean;
  metadata: {
    schema_version: string;
    prompt_version: string;
    model_version: string;
    generated_at: string;
    review_required: true;
  };
  neutral_notice: string;
  limitations: string[];
  safety: {
    blocked_terms_found: string[];
    fallback_used: boolean;
    warnings: YsisSafetyWarning[];
  };
  result: TResult;
};
