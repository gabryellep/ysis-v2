import type { RelatoPurpose } from "@/lib/ysis/types";

type DemoReport = {
  title: string;
  summary: string;
  mainPoints: string[];
  reportedSituations: string[];
  suggestedQuestions: string[];
  importantNotes: string[];
};

const purposeLabels: Record<RelatoPurpose, string> = {
  gynecologist: "ginecologista",
  psychologist: "psicologa",
  obstetrics: "obstetricia",
  sensitive_situation: "situacao sensivel",
  personal: "registrar para mim"
};

const purposeQuestions: Record<RelatoPurpose, string[]> = {
  gynecologist: ["Quando comecou, com que frequencia aparece e qual intensidade voce relatou?", "Ha relacao com ciclo, rotina ou contexto corporal informado?"],
  psychologist: ["Qual frase de abertura parece possivel para conversar sobre isso?", "Quais sentimentos, medos ou bloqueios voce quer nomear?"],
  obstetrics: ["Qual contexto gestacional foi informado?", "Quais sinais relatados podem ser levados para avaliacao profissional?"],
  sensitive_situation: ["Quais partes voce lembra e quais parecem incertas?", "Que limites e apoio desejado voce quer registrar?"],
  personal: [
    "O que mudou desde que voce percebeu essa situacao?",
    "Que informacoes voce quer guardar para comparar depois, se fizer sentido?"
  ]
};

export function buildDemoReport(relato: string, purpose: RelatoPurpose): DemoReport {
  const cleanRelato = normalizeText(relato);
  const sentences = splitSentences(cleanRelato);
  const points = extractPoints(sentences, cleanRelato);
  const situations = extractSituations(sentences, cleanRelato);

  return {
    title: `Relatorio demonstrativo para ${purposeLabels[purpose]}`,
    summary: `Voce relatou: ${summarize(cleanRelato)} Este texto organiza seu relato para revisao e nao faz diagnostico.`,
    mainPoints: points,
    reportedSituations: situations,
    suggestedQuestions: [
      ...purposeQuestions[purpose],
      "Pode ser util conversar com uma profissional sobre os pontos que mais preocupam voce?"
    ],
    importantNotes: [
      "Este material nao substitui atendimento profissional.",
      "Voce controla o que deseja manter, editar, copiar ou apagar.",
      "As informacoes podem ser editadas antes de copiar ou levar para uma consulta.",
      "Se houver dor intensa, sangramento importante, febre, desmaio ou outro sinal urgente, procure atendimento de saude."
    ]
  };
}

export function formatDemoReport(report: DemoReport) {
  return [
    report.title,
    "",
    "Resumo do relato",
    report.summary,
    "",
    "Pontos principais mencionados",
    ...report.mainPoints.map((item) => `- ${item}`),
    "",
    "Sintomas ou situacoes relatadas",
    ...report.reportedSituations.map((item) => `- ${item}`),
    "",
    "Perguntas que voce pode levar para atendimento",
    ...report.suggestedQuestions.map((item) => `- ${item}`),
    "",
    "Observacoes importantes",
    ...report.importantNotes.map((item) => `- ${item}`)
  ].join("\n");
}

function normalizeText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function splitSentences(text: string) {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function summarize(text: string) {
  if (!text) return "um relato ainda sem detalhes suficientes.";
  if (text.length <= 260) return text;
  return `${text.slice(0, 257).trim()}...`;
}

function extractPoints(sentences: string[], text: string) {
  const source = sentences.length ? sentences : [text];
  const points = source.slice(0, 4).map((sentence) => sentence.replace(/[.!?]$/, ""));

  if (points.length === 0) {
    return ["Voce relatou uma situacao de saude intima que merece ser revisada com calma."];
  }

  return points.map((point) => `Voce relatou ${lowerFirst(point)}.`);
}

function extractSituations(sentences: string[], text: string) {
  const terms = [
    "dor",
    "coceira",
    "ardor",
    "corrimento",
    "sangramento",
    "cheiro",
    "ciclo",
    "menstruacao",
    "relacao",
    "sexo",
    "ansiedade",
    "medo",
    "desconforto"
  ];
  const matches = terms.filter((term) => text.toLowerCase().includes(term));

  if (matches.length > 0) {
    return matches.slice(0, 5).map((term) => `Foi mencionado algo relacionado a ${term}.`);
  }

  return (sentences.length ? sentences.slice(0, 3) : [text]).map((sentence) => `Situacao descrita: ${sentence.replace(/[.!?]$/, "")}.`);
}

function lowerFirst(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}
