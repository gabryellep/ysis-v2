import type { RelatoDraft } from "@/lib/session/experience-state";

export type ConsentKey = keyof RelatoDraft["consent"];

export const consentItems: Array<{ key: ConsentKey; label: string }> = [
  { key: "professionalCare", label: "Entendo que a Ysis nao substitui atendimento profissional." },
  { key: "canReview", label: "Entendo que posso revisar e editar meu texto antes de usar." },
  { key: "demoNoPermanentSave", label: "Entendo que esta versao e demonstrativa e nao salva meu texto permanentemente." },
  { key: "aiProcessing", label: "Autorizo o processamento temporario por IA para organizar um rascunho revisavel." },
  { key: "voiceIsDemo", label: "Entendo que audio, transcricao e relato nao sao salvos por padrao." }
];

export const privacyNotes = [
  "A Ysis ajuda a organizar seu registro, mas nao faz diagnostico nem prescreve.",
  "Voce pode revisar, editar e apagar o conteudo quando quiser.",
  "Nada e enviado automaticamente.",
  "Nesta versao demonstrativa, o conteudo nao e salvo permanentemente.",
  "Se houver dor intensa, sangramento importante, febre, desmaio ou outro sinal urgente, procure atendimento de saude."
];

export function hasMinimumConsent(consent: RelatoDraft["consent"]) {
  return consentItems.every((item) => consent[item.key]);
}
