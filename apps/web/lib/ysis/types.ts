export type RelatoPurpose = "consultation" | "symptoms" | "conversation" | "personal";

export type DemoReport = {
  title: string;
  summary: string;
  mainPoints: string[];
  reportedSituations: string[];
  suggestedQuestions: string[];
  importantNotes: string[];
};
