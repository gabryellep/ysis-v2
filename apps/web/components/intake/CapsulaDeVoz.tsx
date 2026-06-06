"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { RelatoDraft } from "@/lib/session/experience-state";

type VoiceState =
  | "awaiting-consent"
  | "awaiting-permission"
  | "recording"
  | "paused"
  | "recorded"
  | "processing"
  | "transcribed"
  | "mic-error"
  | "transcription-error"
  | "audio-deleted";

type TranscriptionEnvelope = {
  ok: boolean;
  result?: {
    transcript?: string;
    provider?: "mock" | "openai";
    provider_mode?: "mock" | "real";
    audio_saved?: false;
    persisted?: false;
    note?: string;
  };
};

type CapsulaDeVozProps = {
  draft: RelatoDraft;
  discreetMode: boolean;
  onChange: (draft: Partial<RelatoDraft>) => void;
  onBack: () => void;
  onReview: () => void;
  onSwitchToWrite: () => void;
};

const CONSENT_VERSION = "audio-transcription-phase7a-v1";
const API_BASE_URL = process.env.NEXT_PUBLIC_YSIS_API_URL ?? "http://127.0.0.1:8000";

export function CapsulaDeVoz({ draft, discreetMode, onChange, onBack, onReview, onSwitchToWrite }: CapsulaDeVozProps) {
  const [state, setState] = useState<VoiceState>("awaiting-consent");
  const [consented, setConsented] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [providerMode, setProviderMode] = useState<"mock" | "real" | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (state !== "recording") return;
    const interval = window.setInterval(() => setDuration((current) => current + 1), 1000);
    return () => window.clearInterval(interval);
  }, [state]);

  useEffect(() => {
    return () => {
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      stopStream();
    };
  }, []);

  useEffect(() => {
    audioUrlRef.current = audioUrl;
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  async function startRecording() {
    if (!consented) return;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setErrorMessage("Seu navegador nao liberou gravacao de audio aqui. Voce pode continuar escrevendo.");
      setState("mic-error");
      return;
    }

    cleanupAudio();
    setErrorMessage(null);
    setProviderMode(null);
    setDuration(0);
    setState("awaiting-permission");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const mimeType = pickSupportedMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onerror = () => {
        setErrorMessage("Nao foi possivel manter a gravacao. Voce pode tentar de novo ou escrever.");
        setState("mic-error");
        stopStream();
      };
      recorder.onstop = () => {
        const nextBlob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        chunksRef.current = [];
        stopStream();
        if (nextBlob.size === 0) {
          setErrorMessage("A gravacao ficou vazia. Tente novamente ou escreva.");
          setState("mic-error");
          return;
        }
        const nextUrl = URL.createObjectURL(nextBlob);
        setAudioBlob(nextBlob);
        setAudioUrl((current) => {
          if (current) URL.revokeObjectURL(current);
          audioUrlRef.current = nextUrl;
          return nextUrl;
        });
        setState("recorded");
      };

      recorder.start();
      setState("recording");
    } catch {
      stopStream();
      setErrorMessage("Permissao do microfone negada ou indisponivel. Voce pode continuar escrevendo.");
      setState("mic-error");
    }
  }

  function pauseRecording() {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state !== "recording" || typeof recorder.pause !== "function") return;
    recorder.pause();
    setState("paused");
  }

  function resumeRecording() {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state !== "paused" || typeof recorder.resume !== "function") return;
    recorder.resume();
    setState("recording");
  }

  function finishRecording() {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") return;
    recorder.stop();
  }

  async function sendForTranscription() {
    if (!audioBlob || !consented) return;
    setState("processing");
    setErrorMessage(null);

    const form = new FormData();
    form.append("audio", audioBlob, `ysis-audio-${Date.now()}.${extensionFor(audioBlob.type)}`);
    form.append("audio_consent_granted", "true");
    form.append("consent_text_version", CONSENT_VERSION);
    form.append("discreet_mode", String(discreetMode));

    try {
      const response = await fetch(`${API_BASE_URL}/audio/transcrever`, {
        method: "POST",
        body: form,
      });
      if (!response.ok) throw new Error("transcription_failed");

      const payload = (await response.json()) as TranscriptionEnvelope;
      const transcript = payload.result?.transcript?.trim() ?? "";
      if (!transcript) throw new Error("empty_transcript");

      onChange({ text: transcript, inputMode: "voice" });
      setProviderMode(payload.result?.provider_mode ?? null);
      cleanupAudio();
      setState("transcribed");
    } catch {
      setErrorMessage("Nao foi possivel transcrever agora. O audio local pode ser apagado ou enviado novamente.");
      setState("transcription-error");
    }
  }

  function deleteAudio() {
    cleanupAudio();
    setDuration(0);
    setState("audio-deleted");
  }

  function rerecord() {
    cleanupAudio();
    onChange({ text: "", inputMode: "voice" });
    setDuration(0);
    setErrorMessage(null);
    setProviderMode(null);
    setState(consented ? "awaiting-permission" : "awaiting-consent");
    if (consented) void startRecording();
  }

  function cancelToWrite() {
    cleanupAudio();
    stopStream();
    onChange({ inputMode: "writing" });
    onSwitchToWrite();
  }

  function cleanupAudio() {
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = null;
    setAudioUrl(null);
    setAudioBlob(null);
    chunksRef.current = [];
  }

  function stopStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
  }

  const canPause = typeof recorderRef.current?.pause === "function";
  const copy = getCopy(discreetMode, state, providerMode);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="flex min-h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm text-muted transition hover:text-ink">
          <span>&lt;-</span>
          Voltar
        </button>
        <button type="button" onClick={cancelToWrite} className="rounded-xl bg-[rgba(188,167,219,0.18)] px-3 py-2 text-sm text-[rgb(var(--color-lavender-deep))] transition hover:bg-[rgba(188,167,219,0.3)]">
          Escrever
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-3xl">
          <div className="relative min-h-[34rem] overflow-hidden rounded-[3rem] border border-[rgba(188,167,219,0.28)] bg-[linear-gradient(135deg,rgba(188,167,219,0.3),rgba(255,251,246,0.84),rgba(231,176,184,0.14))] p-6 shadow-[0_18px_54px_rgba(129,94,158,0.11)] lg:p-10">
            <div className="relative z-10 flex min-h-[28rem] flex-col items-center justify-center">
              <div className="mb-6 flex h-20 items-center gap-1.5">
                <VoiceWave state={state} />
              </div>

              {state === "awaiting-consent" ? (
                <AudioConsent discreetMode={discreetMode} consented={consented} onConsentChange={setConsented} onStart={startRecording} onWrite={cancelToWrite} />
              ) : null}

              {state !== "awaiting-consent" ? (
                <AnimatePresence mode="wait">
                  <motion.div key={state} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="flex w-full flex-col items-center">
                    {state === "recording" || state === "paused" || state === "recorded" || state === "processing" ? (
                      <div className="mb-5 font-mono text-3xl text-[rgb(var(--color-lavender-deep))]">{formatTime(duration)}</div>
                    ) : null}

                    <h1 className="text-center font-display text-4xl italic leading-tight text-ink">{copy.title}</h1>
                    <p className="mt-3 max-w-xl text-center text-sm leading-6 text-muted">{copy.text}</p>

                    {audioUrl && state !== "transcribed" ? <audio controls src={audioUrl} className="mt-5 w-full max-w-md" /> : null}
                    {errorMessage ? <p className="mt-5 max-w-lg rounded-2xl bg-[rgba(231,176,184,0.18)] px-4 py-3 text-center text-sm leading-6 text-wine">{errorMessage}</p> : null}

                    <Controls
                      state={state}
                      canPause={canPause}
                      hasAudio={Boolean(audioBlob)}
                      hasText={Boolean(draft.text.trim())}
                      onStart={startRecording}
                      onPause={pauseRecording}
                      onResume={resumeRecording}
                      onFinish={finishRecording}
                      onDeleteAudio={deleteAudio}
                      onSend={sendForTranscription}
                      onRerecord={rerecord}
                      onReview={onReview}
                      onWrite={cancelToWrite}
                    />

                    {state === "transcribed" ? (
                      <div className="mt-6 w-full max-w-2xl">
                        <label className="mb-2 block text-sm font-semibold text-ink">{discreetMode ? "Texto para revisar" : "Transcricao para revisar"}</label>
                        <textarea
                          value={draft.text}
                          onChange={(event) => onChange({ text: event.target.value, inputMode: "voice" })}
                          aria-label={discreetMode ? "Texto transcrito editavel" : "Transcricao editavel"}
                          className="min-h-40 w-full resize-none rounded-2xl border border-[rgba(103,43,66,0.08)] bg-[rgb(var(--color-paper))] p-4 text-sm leading-6 text-ink outline-none placeholder:text-muted/50"
                        />
                        <p className="mt-2 text-xs text-muted">{discreetMode ? "Revise, edite ou apague antes de continuar." : "A transcricao pode errar. Revise, edite ou apague antes de continuar."}</p>
                      </div>
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              ) : null}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--color-lavender-deep))]" />
            Audio temporario: nao e salvo por padrao e pode ser apagado antes do envio
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function AudioConsent({ discreetMode, consented, onConsentChange, onStart, onWrite }: { discreetMode: boolean; consented: boolean; onConsentChange: (value: boolean) => void; onStart: () => void; onWrite: () => void }) {
  return (
    <div className="w-full max-w-2xl text-center">
      <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--color-lavender-deep))]">{discreetMode ? "permissao de audio" : "consentimento de audio"}</p>
      <h1 className="mt-4 font-display text-4xl italic leading-tight text-ink">{discreetMode ? "Usar audio temporario?" : "Voce autoriza gravar para transcrever?"}</h1>
      <div className="mt-5 rounded-2xl border border-[rgba(103,43,66,0.08)] bg-[rgb(var(--color-paper))] p-5 text-left text-sm leading-7 text-muted">
        <p>O audio sera usado apenas para gerar uma transcricao.</p>
        <p>O audio nao sera salvo por padrao.</p>
        <p>A transcricao podera ser revisada, editada ou apagada.</p>
        <p>Voce pode continuar escrevendo se nao quiser gravar.</p>
      </div>
      <label className="mt-5 flex items-start gap-3 rounded-2xl bg-white/50 p-4 text-left text-sm leading-6 text-ink">
        <input type="checkbox" checked={consented} onChange={(event) => onConsentChange(event.target.checked)} className="mt-1 h-4 w-4 accent-[rgb(var(--color-wine))]" />
        <span>Entendi e autorizo o uso temporario do audio apenas para gerar uma transcricao revisavel.</span>
      </label>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={onWrite} className="rounded-xl bg-[rgba(188,167,219,0.2)] px-4 py-2.5 text-sm text-[rgb(var(--color-lavender-deep))] transition hover:bg-[rgba(188,167,219,0.34)]">
          Continuar escrevendo
        </button>
        <button type="button" onClick={onStart} disabled={!consented} className="rounded-xl bg-[rgb(var(--color-wine))] px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-[rgba(103,43,66,0.9)] disabled:cursor-not-allowed disabled:opacity-45">
          Iniciar gravacao
        </button>
      </div>
    </div>
  );
}

function Controls(props: {
  state: VoiceState;
  canPause: boolean;
  hasAudio: boolean;
  hasText: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
  onDeleteAudio: () => void;
  onSend: () => void;
  onRerecord: () => void;
  onReview: () => void;
  onWrite: () => void;
}) {
  if (props.state === "awaiting-permission") {
    return <div className="mt-6 text-sm text-muted">Aguardando permissao do microfone...</div>;
  }
  if (props.state === "recording") {
    return (
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {props.canPause ? <RoundAction onClick={props.onPause} label="Pausar" tone="lavender" /> : null}
        <RoundAction onClick={props.onFinish} label="Finalizar" tone="wine" />
      </div>
    );
  }
  if (props.state === "paused") {
    return (
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <RoundAction onClick={props.onResume} label="Continuar" tone="lavender" />
        <RoundAction onClick={props.onFinish} label="Finalizar" tone="wine" />
      </div>
    );
  }
  if (props.state === "recorded" || props.state === "transcription-error") {
    return (
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={props.onDeleteAudio} className="rounded-xl bg-[rgba(231,176,184,0.18)] px-4 py-2.5 text-sm text-wine transition hover:bg-[rgba(231,176,184,0.28)]">
          Apagar audio
        </button>
        <button type="button" onClick={props.onRerecord} className="rounded-xl bg-[rgba(188,167,219,0.2)] px-4 py-2.5 text-sm text-[rgb(var(--color-lavender-deep))] transition hover:bg-[rgba(188,167,219,0.34)]">
          Regravar
        </button>
        <button type="button" onClick={props.onSend} disabled={!props.hasAudio} className="rounded-xl bg-[rgb(var(--color-wine))] px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-[rgba(103,43,66,0.9)] disabled:cursor-not-allowed disabled:opacity-45">
          Transcrever
        </button>
      </div>
    );
  }
  if (props.state === "processing") {
    return <div className="mt-6 rounded-xl bg-[rgba(188,167,219,0.2)] px-4 py-2.5 text-sm text-[rgb(var(--color-lavender-deep))]">Processando transcricao...</div>;
  }
  if (props.state === "transcribed") {
    return (
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={props.onRerecord} className="rounded-xl bg-[rgba(188,167,219,0.2)] px-4 py-2.5 text-sm text-[rgb(var(--color-lavender-deep))] transition hover:bg-[rgba(188,167,219,0.34)]">
          Regravar
        </button>
        <button type="button" onClick={props.onReview} disabled={!props.hasText} className="rounded-xl bg-[rgb(var(--color-wine))] px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-[rgba(103,43,66,0.9)] disabled:cursor-not-allowed disabled:opacity-45">
          Continuar para revisao
        </button>
      </div>
    );
  }
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
      <button type="button" onClick={props.onWrite} className="rounded-xl bg-[rgba(188,167,219,0.2)] px-4 py-2.5 text-sm text-[rgb(var(--color-lavender-deep))] transition hover:bg-[rgba(188,167,219,0.34)]">
        Escrever
      </button>
      <button type="button" onClick={props.onStart} className="rounded-xl bg-[rgb(var(--color-wine))] px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-[rgba(103,43,66,0.9)]">
        Gravar novamente
      </button>
    </div>
  );
}

function VoiceWave({ state }: { state: VoiceState }) {
  const bars = Array.from({ length: 7 });
  return (
    <>
      {bars.map((_, index) => {
        if (state === "recording" || state === "processing") {
          return <motion.span key={index} animate={{ scaleY: [0.35, 1, 0.45] }} transition={{ duration: 1, repeat: Infinity, delay: index * 0.1 }} className="h-16 w-2 origin-center rounded-full bg-[rgb(var(--color-lavender-deep))]" />;
        }
        if (state === "paused" || state === "recorded" || state === "transcribed") {
          return <span key={index} className="h-5 w-2 rounded-full bg-[rgba(129,94,158,0.5)]" />;
        }
        return <span key={index} className="h-2.5 w-2 rounded-full bg-[rgba(188,167,219,0.72)]" />;
      })}
    </>
  );
}

function RoundAction({ onClick, label, tone }: { onClick: () => void; label: string; tone: "lavender" | "wine" }) {
  const className =
    tone === "wine"
      ? "flex h-20 w-20 items-center justify-center rounded-full bg-[rgb(var(--color-wine))] text-xs font-semibold text-paper transition hover:bg-[rgba(103,43,66,0.9)]"
      : "flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(188,167,219,0.42)] text-[0.62rem] font-semibold text-[rgb(var(--color-lavender-deep))] transition hover:bg-[rgba(188,167,219,0.58)]";
  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

function pickSupportedMimeType() {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  return candidates.find((candidate) => MediaRecorder.isTypeSupported(candidate)) ?? "";
}

function extensionFor(mimeType: string) {
  if (mimeType.includes("mp4")) return "mp4";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("wav")) return "wav";
  return "webm";
}

function getCopy(discreetMode: boolean, state: VoiceState, providerMode: "mock" | "real" | null) {
  if (state === "awaiting-permission") return { title: "Aguardando permissao", text: "O navegador vai pedir acesso ao microfone antes de iniciar." };
  if (state === "recording") return { title: discreetMode ? "Registrando audio" : "Gravando sua fala", text: "A gravacao esta acontecendo agora. Finalize quando quiser." };
  if (state === "paused") return { title: "Pausado", text: "Voce pode continuar ou finalizar para preparar o envio." };
  if (state === "recorded") return { title: "Audio pronto", text: "Voce pode apagar antes de enviar, regravar ou enviar para transcricao temporaria." };
  if (state === "processing") return { title: "Processando", text: "O backend esta gerando uma transcricao revisavel sem salvar o audio por padrao." };
  if (state === "transcribed") {
    const mode = providerMode === "real" ? "Transcricao gerada no backend." : "Modo mock ativo.";
    return { title: discreetMode ? "Texto pronto para revisar" : "Transcricao pronta para revisar", text: `${mode} O audio local foi descartado apos o envio.` };
  }
  if (state === "audio-deleted") return { title: "Audio apagado", text: "O audio local foi removido. Voce pode gravar novamente ou continuar escrevendo." };
  if (state === "transcription-error") return { title: "Nao foi possivel transcrever", text: "O audio local continua sob seu controle para apagar, reenviar ou regravar." };
  return { title: "Microfone indisponivel", text: "Voce pode tentar novamente ou continuar escrevendo." };
}
