export type WorkspaceView = "home" | "intake" | "history" | "report" | "conversation" | "privacy";
export type MesaMode = "privacy" | "rest" | "writing" | "voice" | "review" | "purpose" | "demo-report";

export type RelatoDraft = {
  text: string;
  quickNote: string;
  inputMode: "writing" | "voice" | null;
  purpose: "consultation" | "symptoms" | "conversation" | "personal" | null;
  consent: {
    professionalCare: boolean;
    canReview: boolean;
    demoNoPermanentSave: boolean;
    aiProcessing: boolean;
    voiceIsDemo: boolean;
  };
};

export const initialRelatoDraft: RelatoDraft = {
  text: "",
  quickNote: "",
  inputMode: null,
  purpose: null,
  consent: {
    professionalCare: false,
    canReview: false,
    demoNoPermanentSave: false,
    aiProcessing: false,
    voiceIsDemo: false
  }
};
