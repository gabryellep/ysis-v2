export type WorkspaceView = "home" | "intake" | "history" | "report" | "conversation" | "privacy";
export type MesaMode = "rest" | "writing" | "voice";

export type RelatoDraft = {
  text: string;
  quickNote: string;
};

export const initialRelatoDraft: RelatoDraft = {
  text: "",
  quickNote: ""
};
