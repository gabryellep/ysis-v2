"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const logoSrc = "/lovable/ysis-logo.jpeg";
const orbSrc = "/lovable/orb.png";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function BgAuroras() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="anim-drift absolute -left-40 -top-40 h-[60vw] w-[60vw] rounded-full opacity-60"
        style={{
          background: "radial-gradient(circle, oklch(0.78 0.1 310 / 0.55), transparent 60%)",
          filter: "blur(120px)"
        }}
      />
      <div
        className="anim-drift absolute -right-40 top-[30%] h-[55vw] w-[55vw] rounded-full opacity-55"
        style={{
          background: "radial-gradient(circle, oklch(0.68 0.14 25 / 0.5), transparent 60%)",
          filter: "blur(140px)",
          animationDelay: "-6s"
        }}
      />
      <div
        className="anim-drift absolute bottom-0 left-1/4 h-[50vw] w-[50vw] rounded-full opacity-40"
        style={{
          background: "radial-gradient(circle, oklch(0.32 0.1 350 / 0.45), transparent 60%)",
          filter: "blur(150px)",
          animationDelay: "-12s"
        }}
      />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed left-1/2 top-4 z-50 w-[min(96%,1100px)] -translate-x-1/2">
      <div className="glass flex items-center justify-between rounded-full px-4 py-2.5 shadow-[0_10px_40px_-12px_rgba(107,42,74,0.25)]">
        <a href="#top" className="flex min-w-0 items-center gap-2.5">
          <img src={logoSrc} alt="Ysis" className="h-8 w-8 rounded-full" />
          <span className="flex min-w-0 flex-col leading-none">
            <span className="font-serif text-xl text-[color:var(--wine)]">Ysis</span>
            <span className="max-w-[150px] truncate text-[0.62rem] font-medium text-[color:var(--ink)]/50 sm:max-w-[250px]">
              tecnologia que acolhe, cuidado que transforma
            </span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm text-[color:var(--ink)]/80 lg:flex">
          <a href="#solucao" className="hover:text-[color:var(--wine)]">Solução</a>
          <a href="#jornada" className="hover:text-[color:var(--wine)]">Jornada</a>
          <a href="#relatorios" className="hover:text-[color:var(--wine)]">Relatórios</a>
          <a href="#privacidade" className="hover:text-[color:var(--wine)]">Privacidade</a>
          <a href="#comunidade" className="hover:text-[color:var(--wine)]">Comunidade</a>
        </nav>
        <a
          href="/ferramenta"
          className="bg-gradient-brand rounded-full px-4 py-2 text-xs font-medium text-white shadow-lg shadow-[color:var(--wine)]/20 transition-transform hover:scale-105"
        >
          Começar relato
        </a>
      </div>
    </header>
  );
}

function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const floatWords = [
    { t: "vergonha", x: "8%", y: "18%", size: "text-2xl", style: "italic" as const },
    { t: "dúvida", x: "14%", y: "62%", size: "text-3xl", style: "normal" as const },
    { t: "cuidado", x: "78%", y: "14%", size: "text-4xl", style: "italic" as const },
    { t: "clareza", x: "82%", y: "70%", size: "text-2xl", style: "normal" as const },
    { t: "privacidade", x: "6%", y: "85%", size: "text-xl", style: "italic" as const }
  ];

  return (
    <section id="top" className="relative min-h-[100vh] pb-10 pt-28 md:min-h-[104vh] md:pt-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {floatWords.map((word, index) => (
          <span
            key={word.t}
            className={`font-serif ${word.size} text-outline anim-float-x absolute`}
            style={{
              left: word.x,
              top: word.y,
              fontStyle: word.style,
              animationDelay: `${index * -1.7}s`,
              transform: `translateY(${scrollY * (0.1 + index * 0.04)}px)`
            }}
          >
            {word.t}
          </span>
        ))}
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10">
          <h1 className="reveal font-serif text-[clamp(2.6rem,6.2vw,5.5rem)] leading-[0.98] text-[color:var(--ink)]">
            Fale do jeito que conseguir.<br />
            <span className="italic">A Ysis organiza com </span>
            <span className="text-gradient italic">cuidado.</span>
          </h1>
          <p className="reveal mt-7 max-w-xl text-lg leading-relaxed text-[color:var(--ink)]/70">
            Uma ferramenta de acolhimento digital para relatos íntimos e sensíveis. Você fala ou escreve do jeito que conseguir; a Ysis organiza em
            <span className="text-[color:var(--wine)]"> resumos claros, seguros e revisáveis</span>, sem diagnóstico.
          </p>
          <div className="reveal mt-9 flex flex-wrap items-center gap-3">
            <a
              href="/ferramenta"
              className="bg-gradient-brand group inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium text-white shadow-xl shadow-[color:var(--wine)]/25 transition-transform hover:scale-[1.03]"
            >
              Começar meu relato
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#solucao"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--wine)]/30 bg-white/40 px-7 py-4 text-sm font-medium text-[color:var(--wine)] backdrop-blur hover:bg-white/70"
            >
              Ver como funciona
            </a>
          </div>
          <div className="reveal mt-10 flex flex-wrap items-center gap-6 text-xs text-[color:var(--ink)]/55">
            <span className="flex items-center gap-2"><Dot /> 100% privado</span>
            <span className="flex items-center gap-2"><Dot /> Áudio não salvo</span>
            <span className="flex items-center gap-2"><Dot /> Você revisa</span>
          </div>
        </div>

        <div className="hero-visual relative h-[500px] overflow-visible md:h-[610px]">
          <img
            src={orbSrc}
            alt=""
            aria-hidden
            className="hero-orb anim-spin-slow absolute right-[-0.75rem] top-2 h-[500px] w-[500px] opacity-90 drop-shadow-[0_30px_80px_rgba(107,42,74,0.35)] md:right-[-0.25rem] md:top-[-0.75rem] md:h-[580px] md:w-[580px]"
            style={{ transform: `translateY(${scrollY * -0.065}px) rotate(${scrollY * 0.05}deg)` }}
          />
          <YsisPhoneMockup scrollY={scrollY} />

          <FloatingCard className="left-0 top-20 md:left-2 md:top-16" delay="-2s">
            <CardIcon>voz</CardIcon>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[color:var(--mauve)]">Voz</p>
              <p className="text-sm text-[color:var(--ink)]">Gravando 00:21</p>
            </div>
          </FloatingCard>

          <FloatingCard className="right-0 top-44 md:right-[-1rem] md:top-44" delay="-4s">
            <CardIcon>rel</CardIcon>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[color:var(--rose-burnt)]">Relato</p>
              <p className="text-sm text-[color:var(--ink)]">"Hoje senti..."</p>
            </div>
          </FloatingCard>

          <FloatingCard className="bottom-16 left-6 md:bottom-14" delay="-1s">
            <CardIcon>res</CardIcon>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[color:var(--wine)]">Resumo</p>
              <p className="text-sm text-[color:var(--ink)]">Pronto para revisar</p>
            </div>
          </FloatingCard>

          <FloatingCard className="bottom-2 right-2 md:bottom-6" delay="-3s">
            <CardIcon>per</CardIcon>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[color:var(--mauve)]">Perguntas</p>
              <p className="text-sm text-[color:var(--ink)]">5 sugestões</p>
            </div>
          </FloatingCard>
        </div>
      </div>
    </section>
  );
}

function Dot() {
  return <span className="h-1 w-1 rounded-full bg-[color:var(--rose-burnt)]" />;
}

function YsisPhoneMockup({ scrollY }: { scrollY: number }) {
  return (
    <div
      className="hero-phone anim-float absolute right-[6.75rem] top-0 z-10 h-[520px] w-[260px] rotate-[-5deg] rounded-[2.8rem] border-[10px] border-[color:var(--ink)] bg-[linear-gradient(180deg,#fff9f6,#fff)] shadow-[0_42px_90px_rgba(107,42,74,0.38)] md:right-[8.5rem] md:top-[-1.75rem] md:h-[612px] md:w-[300px]"
      style={{ transform: `translateY(${scrollY * -0.024}px) rotate(-5deg)` }}
    >
      <div className="absolute left-1/2 top-3 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-[color:var(--ink)]" />
      <div className="absolute inset-0 overflow-hidden rounded-[2.2rem]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(188,167,219,0.28),transparent_34%),linear-gradient(180deg,rgba(255,251,246,0.95),rgba(255,255,255,0.98))]" />
        <div className="relative px-5 pb-5 pt-12">
          <div className="flex items-center justify-between text-[0.62rem] font-bold text-[color:var(--ink)]/60">
            <span>9:41</span>
            <span>•••</span>
          </div>
          <div className="mt-5 text-center">
            <p className="font-serif text-3xl text-[color:var(--wine)]">Ysis</p>
            <p className="text-[0.66rem] text-[color:var(--ink)]/45">relato acolhido, resumo revisável</p>
          </div>
          <div className="mx-auto mt-6 grid h-20 w-20 place-items-center rounded-full bg-[linear-gradient(135deg,rgba(188,167,219,0.38),rgba(184,101,118,0.26))] shadow-[0_16px_44px_rgba(129,94,158,0.22)]">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-[linear-gradient(135deg,rgb(var(--color-lavender)),rgb(var(--color-rose)))] text-white shadow-lg">
              <span className="h-7 w-4 rounded-full border-2 border-white" />
            </div>
          </div>
          <div className="mt-5 flex h-12 items-center justify-center gap-1">
            {Array.from({ length: 25 }, (_, index) => (
              <span
                key={index}
                className="ysis-wave-bar w-1 rounded-full bg-[linear-gradient(180deg,rgb(var(--color-lavender)),rgb(var(--color-rose)))]"
                style={{ animationDelay: `${index * 0.04}s`, height: `${10 + ((index * 7) % 28)}px` }}
              />
            ))}
          </div>
          <div className="mt-5 rounded-[1.4rem] border border-[color:var(--wine)]/8 bg-white/72 p-4 shadow-[0_16px_42px_rgba(103,43,66,0.08)]">
            <div className="flex items-center justify-between">
              <p className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[color:var(--mauve)]">Transcrição</p>
              <span className="text-[0.65rem] text-[color:var(--ink)]/35">00:21</span>
            </div>
            <p className="mt-3 text-sm font-medium text-[color:var(--ink)]">Hoje senti uma mudança e queria organizar melhor...</p>
            <p className="mt-2 text-right text-[0.65rem] text-[color:var(--wine)]/55">Editar</p>
          </div>
          <div className="mt-4 rounded-[1.4rem] border border-[color:var(--wine)]/8 bg-white/78 p-4 shadow-[0_16px_42px_rgba(103,43,66,0.08)]">
            <div className="flex items-center justify-between">
              <p className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[color:var(--rose-burnt)]">Resumo revisável</p>
              <span className="text-[color:var(--rose-burnt)]">✦</span>
            </div>
            {["Sinais relatados", "Tempo e intensidade", "Pontos para consulta"].map((item) => (
              <div key={item} className="mt-3 flex items-center gap-2">
                <span className="h-7 w-7 rounded-full bg-[color:var(--rose-burnt)]/12" />
                <span className="text-[0.72rem] font-medium text-[color:var(--ink)]/72">{item}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 h-10 w-full rounded-full bg-[linear-gradient(135deg,rgb(var(--color-rose)),rgb(var(--color-wine)))] text-xs font-bold text-white shadow-lg" type="button">
            Ver relatório
          </button>
        </div>
      </div>
    </div>
  );
}

function CardIcon({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gradient-brand flex h-9 w-9 items-center justify-center rounded-full text-[0.55rem] font-black uppercase tracking-tight text-white shadow-md">
      {children}
    </div>
  );
}

function FloatingCard({
  children,
  className = "",
  delay = "0s"
}: {
  children: ReactNode;
  className?: string;
  delay?: string;
}) {
  return (
    <div
      className={`hero-floating-card glass anim-float absolute z-10 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-xl shadow-[color:var(--wine)]/15 ${className}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
}

function Problem() {
  const phrases = [
    "não sei explicar direito...",
    "tenho vergonha de dizer isso",
    "será que é normal?",
    "esqueço tudo na hora da consulta",
    "não queria parecer exagerada",
    "prefiro escrever antes de falar",
    "não sei se isso é importante",
    "não queria pesquisar sozinha"
  ];

  return (
    <section className="relative py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        <div className="reveal">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[color:var(--rose-burnt)]">O silêncio que machuca</p>
          <h2 className="font-serif text-5xl leading-[1.05] text-[color:var(--ink)] md:text-6xl">
            Entre perceber algo estranho e pedir ajuda, muitas mulheres <span className="text-gradient italic">travam</span>.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-[color:var(--ink)]/70">
            Muitas sabem o que sentem, mas não sabem como falar. Vergonha, medo de julgamento, buscas soltas na internet e detalhes esquecidos podem atrasar o cuidado.
          </p>
          <p className="mt-5 max-w-md rounded-[1.4rem] border border-white/70 bg-white/52 p-5 text-sm font-semibold leading-6 text-[color:var(--wine)] shadow-veil backdrop-blur">
            A Ysis ajuda você a transformar vergonha, dúvida e confusão em um relato claro, revisável e mais fácil de levar a uma profissional.
          </p>
        </div>
        <div className="relative h-[520px]">
          {phrases.map((phrase, index) => {
            const positions = [
              "top-0 left-4",
              "top-12 right-0",
              "top-40 left-12",
              "top-52 right-8",
              "bottom-32 left-0",
              "bottom-20 right-10",
              "bottom-8 left-12",
              "bottom-0 right-2"
            ];
            return (
              <div
                key={phrase}
                className={`glass reveal anim-float-x absolute max-w-xs rounded-3xl rounded-bl-md px-5 py-4 text-[color:var(--ink)]/85 shadow-lg ${positions[index]}`}
                style={{ transitionDelay: `${index * 90}ms`, animationDelay: `${index * -0.8}s` }}
              >
                <span className="font-serif text-lg italic">"{phrase}"</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Solution() {
  const steps = [
    { n: "01", t: "Texto ou voz", d: "Você fala ou escreve do jeito que conseguir, sem roteiro." },
    { n: "02", t: "IA organiza", d: "A Ysis estrutura seu relato em tópicos claros." },
    { n: "03", t: "Você revisa", d: "Edita, ajusta e aprova antes de qualquer coisa sair." },
    { n: "04", t: "Relatório claro", d: "Pronto para consulta, registro ou apoio profissional." }
  ];

  return (
    <section id="solucao" className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[color:var(--mauve)]">A solução</p>
          <h2 className="font-serif text-5xl leading-[1.05] text-[color:var(--ink)] md:text-6xl">
            Do desabafo confuso ao <span className="text-gradient italic">resumo claro</span>.
          </h2>
        </div>
        <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.n}
              className="glass reveal group relative overflow-hidden rounded-3xl p-7 transition-transform hover:-translate-y-2"
              style={{
                transitionDelay: `${index * 120}ms`,
                transform: `translateY(${index % 2 ? "16px" : "0"})`
              }}
            >
              <span className="font-serif text-7xl text-outline">{step.n}</span>
              <h3 className="mt-4 font-serif text-2xl text-[color:var(--ink)]">{step.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--ink)]/65">{step.d}</p>
              <div className="bg-gradient-brand absolute -bottom-12 -right-12 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionMotion() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { n: "01", icon: "✦", t: "Texto ou voz", d: "A usuária fala ou escreve do próprio jeito." },
    { n: "02", icon: "~", t: "Transcrição", d: "Quando há voz, ela vira texto editável." },
    { n: "03", icon: "·", t: "Organização", d: "A IA separa sinais, tempo, contexto e dúvidas." },
    { n: "04", icon: "✓", t: "Resumo", d: "O material fica claro, seguro e revisável." }
  ];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % steps.length);
    }, 2400);
    return () => window.clearInterval(interval);
  }, [steps.length]);

  return (
    <section id="solucao" className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[color:var(--mauve)]">A solução</p>
          <h2 className="font-serif text-5xl leading-[1.05] text-[color:var(--ink)] md:text-6xl">
            Do desabafo confuso ao <span className="text-gradient italic">resumo claro</span>.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[color:var(--ink)]/62">
            Você pode falar ou escrever do seu jeito. A Ysis transcreve quando necessário, organiza o relato e transforma tudo em um resumo claro, seguro e revisável.
          </p>
        </div>

        <div className="reveal relative mt-16 overflow-hidden rounded-[44px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.62),rgba(231,176,184,0.18),rgba(188,167,219,0.16))] p-6 shadow-bloom backdrop-blur-[26px] md:p-9">
          <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-[color:var(--lavender)]/20 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[color:var(--rose-burnt)]/18 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <div className="relative hidden h-1 rounded-full bg-[color:var(--wine)]/10 lg:block">
                <div className="bg-gradient-brand absolute inset-y-0 left-0 rounded-full transition-all duration-700" style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }} />
              </div>
              <div className="mt-0 grid gap-4 sm:grid-cols-2 lg:mt-10">
                {steps.map((step, index) => (
                  <button
                    key={step.n}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className={`group relative overflow-hidden rounded-[1.6rem] border p-5 text-left shadow-[0_16px_50px_rgba(103,43,66,0.09)] backdrop-blur transition-all duration-500 ${
                      index <= activeStep ? "border-[color:var(--rose-burnt)]/28 bg-white/74" : "border-white/70 bg-white/42 hover:bg-white/64"
                    }`}
                  >
                    <span className="flex items-center gap-2 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[color:var(--rose-burnt)]">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-[color:var(--rose-burnt)]/10 text-base tracking-normal">{step.icon}</span>
                      {step.n}
                    </span>
                    <p className="mt-5 font-serif text-3xl leading-none text-[color:var(--wine)]">{step.t}</p>
                    <p className="mt-3 text-sm leading-6 text-[color:var(--ink)]/62">{step.d}</p>
                    {index === activeStep && <span className="bg-gradient-brand absolute bottom-0 left-0 h-1 w-full" />}
                  </button>
                ))}
              </div>
            </div>
            <VoiceToReportTransform activeStep={activeStep} />
          </div>
        </div>
      </div>
    </section>
  );
}

function VoiceToReportTransform({ activeStep }: { activeStep: number }) {
  const labels = ["Texto ou voz", "Transcrição", "Organizado", "Resumo"];
  const chips = ["tempo", "sinal", "dúvida", "contexto", "intensidade", "próximo passo"];

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/58 p-5 shadow-[0_22px_74px_rgba(103,43,66,0.13)] backdrop-blur-[22px]">
      <div className="flex items-center justify-between border-b border-[color:var(--wine)]/8 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--mauve)]">Fluxo Ysis</p>
          <p className="font-serif text-2xl text-[color:var(--wine)]">texto/voz → relato → resumo</p>
        </div>
        <span className="rounded-full bg-[color:var(--rose-burnt)]/10 px-3 py-1 text-xs font-bold text-[color:var(--wine)]">revisável</span>
      </div>

      <div className="relative mt-5 grid gap-4 md:grid-cols-4">
        <div aria-hidden className="absolute left-[10%] right-[10%] top-1/2 hidden h-px bg-[linear-gradient(90deg,transparent,rgba(103,43,66,0.18),transparent)] md:block" />
        {labels.map((label, index) => (
          <div key={label} className={`relative rounded-[1.25rem] border p-4 transition-all duration-500 ${index <= activeStep ? "translate-y-0 border-[color:var(--rose-burnt)]/24 bg-white/78 opacity-100 shadow-[0_14px_42px_rgba(103,43,66,0.09)]" : "translate-y-2 border-white/70 bg-white/35 opacity-55"}`}>
            <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-[color:var(--wine)]/48">0{index + 1}</p>
            <p className="mt-2 text-sm font-bold text-[color:var(--wine)]">{label}</p>
            <div className="mt-4 h-20 rounded-[1rem] bg-[color:var(--cream)]/78 p-3">
              {index === 0 && (
                <div className="flex h-full items-center justify-center gap-1">
                  {Array.from({ length: 15 }, (_, bar) => (
                    <span key={bar} className={`ysis-wave-bar w-1 rounded-full bg-[linear-gradient(180deg,rgb(var(--color-lavender)),rgb(var(--color-rose)))] ${activeStep === 0 ? "" : "opacity-35"}`} style={{ height: `${10 + ((bar * 9) % 34)}px`, animationDelay: `${bar * 0.04}s` }} />
                  ))}
                </div>
              )}
              {index === 1 && (
                <div className="space-y-2 pt-2">
                  {[88, 64, 76, 42].map((width, line) => (
                    <span key={width} className="block h-2 rounded-full bg-[color:var(--wine)]/16" style={{ width: activeStep >= 1 ? `${width}%` : "12%", transition: `width ${500 + line * 80}ms ease` }} />
                  ))}
                </div>
              )}
              {index === 2 && (
                <div className="grid grid-cols-2 gap-2">
                  {chips.slice(0, 4).map((item, chipIndex) => (
                    <span key={item} className={`rounded-xl bg-[color:var(--lavender)]/18 px-2 py-2 text-center text-[0.65rem] font-bold text-[color:var(--wine)] transition-all duration-500 ${activeStep >= 2 ? "scale-100 opacity-100" : "scale-75 opacity-45"}`} style={{ transitionDelay: `${chipIndex * 80}ms` }}>
                      {item}
                    </span>
                  ))}
                </div>
              )}
              {index === 3 && (
                <div className="space-y-2">
                  <span className="block h-3 w-3/5 rounded-full bg-[color:var(--rose-burnt)]/24" />
                  <span className="block h-2 w-full rounded-full bg-[color:var(--wine)]/12" />
                  <span className="block h-2 w-5/6 rounded-full bg-[color:var(--wine)]/10" />
                  <span className="mt-2 inline-flex rounded-full bg-[color:var(--rose-burnt)]/12 px-3 py-1 text-[0.62rem] font-bold text-[color:var(--wine)]">pronto</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-[1.4rem] bg-[color:var(--wine)]/[0.06] p-4 text-sm font-medium leading-6 text-[color:var(--ink)]/68">
        A usuária pode começar por texto ou voz. O áudio não é salvo por padrão; a transcrição é editável e só depois vira resumo.
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {chips.map((chip, index) => (
          <span
            key={chip}
            className={`rounded-full border border-white/70 bg-white/54 px-3 py-1.5 text-[0.68rem] font-bold text-[color:var(--wine)] shadow-[0_8px_24px_rgba(103,43,66,0.06)] transition-all duration-500 ${
              activeStep >= 2 || index < 2 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-35"
            }`}
            style={{ transitionDelay: `${index * 60}ms` }}
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

function Journey() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const wrap = wrapRef.current;
      const track = trackRef.current;
      if (!wrap || !track) return;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = wrap.offsetHeight - vh;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const nextProgress = total > 0 ? scrolled / total : 0;
      setProgress(nextProgress);
      const maxX = track.scrollWidth - window.innerWidth;
      track.style.transform = `translateX(${-nextProgress * maxX}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const panels = [
    { n: "01", t: "Conte por texto ou voz", d: "Sem cobranças, sem roteiro. Do seu jeito, no seu tempo." },
    { n: "02", t: "A Ysis organiza", d: "Transcreve quando preciso, estrutura e adapta a linguagem com cuidado." },
    { n: "03", t: "Você revisa", d: "Lê, ajusta e decide o que faz sentido manter." },
    { n: "04", t: "Escolha a finalidade", d: "Consulta, registro pessoal, urgência ou situação sensível." },
    { n: "05", t: "Chegue com clareza", d: "Resumo, pontos e sugestões para conversar melhor com a profissional." }
  ];

  return (
    <section id="jornada" ref={wrapRef} className="relative" style={{ height: `${panels.length * 90}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute left-0 right-0 top-24 z-10 mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[color:var(--rose-burnt)]">A jornada</p>
              <h2 className="font-serif text-4xl text-[color:var(--ink)] md:text-5xl">
                Cinco passos, <span className="text-gradient italic">um cuidado contínuo</span>.
              </h2>
            </div>
            <p className="hidden text-sm text-[color:var(--ink)]/50 md:block">role para avançar →</p>
          </div>
          <div className="mt-6 h-[3px] w-full overflow-hidden rounded-full bg-[color:var(--wine)]/10">
            <div className="bg-gradient-brand h-full rounded-full" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>

        <div
          ref={trackRef}
          className="absolute left-0 top-0 flex h-full items-center gap-8 pl-[10vw] pr-[20vw] pt-44 will-change-transform"
        >
          {panels.map((panel, index) => (
            <div
              key={panel.n}
              className="glass relative h-[460px] w-[80vw] max-w-[640px] shrink-0 overflow-hidden rounded-[36px] p-10"
            >
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="font-serif text-8xl text-outline">{panel.n}</span>
                  <div className="bg-gradient-brand h-16 w-16 rounded-full opacity-80 blur-[2px]" style={{ animationDelay: `${index * -2}s` }} />
                </div>
                <div>
                  <h3 className="font-serif text-4xl leading-tight text-[color:var(--ink)]">{panel.t}</h3>
                  <p className="mt-3 max-w-md text-base text-[color:var(--ink)]/65">{panel.d}</p>
                </div>
              </div>
              <div
                aria-hidden
                className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full opacity-50 blur-3xl"
                style={{ background: "var(--gradient-brand)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JourneyAuto() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const panels = [
    { n: "01", t: "Conte por texto ou voz", d: "Sem cobranças, sem roteiro. Do seu jeito, no seu tempo." },
    { n: "02", t: "A Ysis organiza", d: "Transcreve quando preciso, estrutura e adapta a linguagem com cuidado." },
    { n: "03", t: "Você revisa", d: "Lê, ajusta e decide o que faz sentido manter." },
    { n: "04", t: "Escolha a finalidade", d: "Consulta, registro pessoal, urgência ou situação sensível." },
    { n: "05", t: "Chegue com clareza", d: "Resumo, pontos e sugestões para conversar melhor com a profissional." }
  ];

  useEffect(() => {
    if (paused) return;
    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % panels.length);
    }, 3800);
    return () => window.clearInterval(interval);
  }, [paused, panels.length]);

  const move = (direction: number) => {
    setPaused(true);
    setActive((current) => (current + direction + panels.length) % panels.length);
    window.setTimeout(() => setPaused(false), 7000);
  };

  return (
    <section id="jornada" className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[color:var(--rose-burnt)]">A jornada</p>
            <h2 className="font-serif text-4xl text-[color:var(--ink)] md:text-5xl">
              Cinco passos, <span className="text-gradient italic">um cuidado contínuo</span>.
            </h2>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => move(-1)} className="glass grid h-12 w-12 place-items-center rounded-full text-2xl text-[color:var(--wine)]" aria-label="Etapa anterior">‹</button>
            <button type="button" onClick={() => move(1)} className="glass grid h-12 w-12 place-items-center rounded-full text-2xl text-[color:var(--wine)]" aria-label="Próxima etapa">›</button>
          </div>
        </div>

        <div className="reveal relative mt-10 overflow-hidden rounded-[44px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.58),rgba(188,167,219,0.16),rgba(231,176,184,0.16))] p-4 shadow-bloom backdrop-blur-[26px] md:p-8" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[color:var(--lavender)]/20 blur-3xl" />
          <div className="overflow-hidden rounded-[32px]">
            <div className="flex transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]" style={{ transform: `translateX(-${active * 100}%)` }}>
              {panels.map((panel, index) => (
                <article key={panel.n} className="w-full shrink-0 p-4 md:p-6">
                  <div className="grid min-h-[360px] gap-8 rounded-[32px] border border-white/60 bg-white/42 p-6 shadow-[0_20px_70px_rgba(103,43,66,0.1)] backdrop-blur md:grid-cols-[0.86fr_1.14fr] md:p-9">
                    <div className="flex flex-col justify-between">
                      <span className="font-serif text-8xl text-outline">{panel.n}</span>
                      <div>
                        <h3 className="font-serif text-5xl leading-none text-[color:var(--ink)]">{panel.t}</h3>
                        <p className="mt-4 max-w-md text-base leading-7 text-[color:var(--ink)]/65">{panel.d}</p>
                      </div>
                    </div>
                    <div className="relative grid place-items-center overflow-hidden rounded-[28px] bg-[color:var(--cream)]/72 p-6">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(103,43,66,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(103,43,66,0.045)_1px,transparent_1px)] bg-[size:34px_34px]" />
                      <div className="relative grid w-full max-w-md gap-3">
                        {["relato livre", "contexto", "resumo revisável"].map((item, itemIndex) => (
                          <div key={item} className={`rounded-[1.4rem] border border-white/70 bg-white/66 p-4 shadow-[0_14px_44px_rgba(103,43,66,0.08)] transition-all duration-500 ${active === index ? "translate-x-0 opacity-100" : "translate-x-6 opacity-55"}`} style={{ transitionDelay: `${itemIndex * 120}ms` }}>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--rose-burnt)]">{item}</p>
                            <span className="mt-3 block h-2 rounded-full bg-[linear-gradient(90deg,rgba(188,167,219,0.72),rgba(184,101,118,0.66),rgba(230,183,126,0.34))]" style={{ width: `${92 - itemIndex * 18}%` }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2">
            {panels.map((panel, index) => (
              <button
                key={panel.n}
                type="button"
                onClick={() => {
                  setPaused(true);
                  setActive(index);
                  window.setTimeout(() => setPaused(false), 7000);
                }}
                aria-label={`Ir para etapa ${index + 1}`}
                className={`h-2.5 rounded-full transition-all ${index === active ? "w-10 bg-[color:var(--wine)]" : "w-2.5 bg-[color:var(--wine)]/20"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AISection() {
  const does = [
    "Transcreve áudio em texto",
    "Organiza relatos em tópicos",
    "Adapta a linguagem com cuidado",
    "Gera relatórios por finalidade",
    "Sugere perguntas ao especialista"
  ];
  const doesnt = ["Não diagnostica", "Não prescreve", "Não substitui profissionais", "Não conclui situações sensíveis"];

  return (
    <section className="relative py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 px-6 lg:grid-cols-2">
        <div className="reveal">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[color:var(--mauve)]">A IA da Ysis</p>
          <h2 className="font-serif text-5xl leading-[1.05] text-[color:var(--ink)] md:text-6xl">
            Uma escuta atenta, <span className="text-gradient italic">com limites claros</span>.
          </h2>
          <ul className="mt-10 space-y-4">
            {does.map((item, index) => (
              <li key={item} className="reveal flex items-start gap-4" style={{ transitionDelay: `${index * 80}ms` }}>
                <span className="bg-gradient-brand mt-1 h-6 w-6 shrink-0 rounded-full" />
                <span className="text-lg text-[color:var(--ink)]/85">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="reveal relative">
          <div className="glass-dark relative overflow-hidden rounded-[40px] p-10 text-white">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-50 blur-3xl" style={{ background: "var(--gradient-brand)" }} />
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--lavender)]">O que ela não faz</p>
            <h3 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
              A Ysis <span className="italic text-[color:var(--lavender)]">cuida do relato</span>. Quem cuida de você é o profissional.
            </h3>
            <div className="mt-10 space-y-4">
              {doesnt.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                  <span className="text-[color:var(--rose-burnt)]">×</span>
                  <span className="text-lg">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm text-white/60">
              As perguntas geradas são sugestões para você levar ao especialista, nunca obrigações para responder.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AISectionMotion() {
  const [active, setActive] = useState(0);
  const inputFragments = [
    "não sei explicar direito...",
    "começou há alguns dias",
    "senti vergonha de falar",
    "mudou a intensidade",
    "tenho dúvidas"
  ];
  const organizedCards = [
    { label: "Sinais", text: "mudanças percebidas e sintomas relatados" },
    { label: "Tempo", text: "quando começou, duração e frequência" },
    { label: "Intensidade", text: "como a usuária percebe o desconforto" },
    { label: "Contexto", text: "sentimentos, vergonha, medo e ansiedade" },
    { label: "Dúvidas", text: "pontos para conversar com a profissional" }
  ];
  const does = [
    "Transcreve voz em texto",
    "Organiza relatos em tópicos",
    "Adapta linguagem com cuidado",
    "Gera relatórios por finalidade",
    "Sugere perguntas para especialista"
  ];
  const flowSteps = [
    { label: "relato livre", detail: "texto ou voz" },
    { label: "organização", detail: "sinais e contexto" },
    { label: "revisão", detail: "usuária ajusta" },
    { label: "relatório", detail: "finalidade escolhida" }
  ];
  const doesnt = [
    "Não diagnostica",
    "Não prescreve",
    "Não substitui profissionais",
    "Não toma decisões médicas",
    "Não conclui situações sensíveis"
  ];

  useEffect(() => {
    const interval = window.setInterval(() => setActive((current) => (current + 1) % does.length), 2600);
    return () => window.clearInterval(interval);
  }, [does.length]);

  return (
    <section className="relative overflow-hidden py-20">
      <div aria-hidden className="absolute left-1/2 top-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[color:var(--lavender)]/18 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[color:var(--mauve)]">A IA da Ysis</p>
          <h2 className="font-serif text-5xl leading-[1.05] text-[color:var(--ink)] md:text-6xl">
            Uma IA que organiza, <span className="text-gradient italic">mas respeita limites</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--ink)]/70">
            A IA da Ysis não tenta diagnosticar. Ela escuta o relato, organiza informações importantes, adapta a linguagem e ajuda você a revisar tudo antes de usar.
          </p>
        </div>

        <div className="reveal relative mt-14 overflow-hidden rounded-[48px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.58),rgba(231,176,184,0.2),rgba(188,167,219,0.18))] p-5 shadow-bloom backdrop-blur-[28px] md:p-8">
          <div className="absolute -left-28 top-20 h-80 w-80 rounded-full bg-[color:var(--rose-burnt)]/16 blur-3xl" />
          <div className="absolute -right-24 bottom-12 h-96 w-96 rounded-full bg-[color:var(--lavender)]/24 blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[0.9fr_0.72fr_1fr] lg:items-stretch">
            <div className="relative min-h-[440px] overflow-hidden rounded-[34px] border border-white/70 bg-white/42 p-6 shadow-[0_22px_70px_rgba(103,43,66,0.1)]">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--rose-burnt)]">relato antes</p>
              <h3 className="mt-3 font-serif text-3xl leading-tight text-[color:var(--wine)]">Frases soltas, vergonha e detalhes difíceis de organizar.</h3>
              <div className="relative mt-8 h-[285px]">
                {inputFragments.map((fragment, index) => (
                  <span
                    key={fragment}
                    className={`ai-fragment glass absolute max-w-[230px] rounded-3xl px-4 py-3 text-sm font-semibold text-[color:var(--ink)]/75 shadow-[0_14px_42px_rgba(103,43,66,0.1)] ${index === active ? "z-10 scale-105 border-[color:var(--rose-burnt)]/30" : ""}`}
                    style={{
                      left: ["2%", "38%", "10%", "48%", "24%"][index],
                      top: ["4%", "18%", "42%", "58%", "78%"][index],
                      animationDelay: `${index * -0.55}s`
                    }}
                  >
                    "{fragment}"
                  </span>
                ))}
              </div>
            </div>

            <div className="relative min-h-[440px] overflow-hidden rounded-[34px] border border-white/70 bg-white/52 p-6 shadow-[0_22px_70px_rgba(103,43,66,0.1)]">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(103,43,66,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(103,43,66,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" />
              <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[color:var(--lavender)]/18 blur-3xl" />
              <p className="relative text-xs font-black uppercase tracking-[0.2em] text-[color:var(--mauve)]">organização visual</p>
              <h3 className="relative mt-3 font-serif text-3xl leading-tight text-[color:var(--wine)]">As peças se agrupam em um resumo revisável.</h3>

              <div className="relative mt-7 h-[300px]">
                <svg aria-hidden viewBox="0 0 320 300" className="absolute inset-0 h-full w-full opacity-70">
                  <path d="M42 66 C112 24, 183 32, 247 72" fill="none" stroke="rgba(103,43,66,0.18)" strokeWidth="2" strokeDasharray="6 9" />
                  <path d="M50 142 C102 122, 191 128, 258 148" fill="none" stroke="rgba(184,101,118,0.22)" strokeWidth="2" strokeDasharray="5 8" />
                  <path d="M58 220 C117 260, 204 248, 266 210" fill="none" stroke="rgba(129,94,158,0.2)" strokeWidth="2" strokeDasharray="6 10" />
                </svg>
                {flowSteps.map((step, index) => (
                  <div
                    key={step.label}
                    className={`ai-flow-card absolute rounded-[1.25rem] border p-4 shadow-[0_16px_48px_rgba(103,43,66,0.1)] backdrop-blur transition-all duration-700 ${
                      index <= Math.min(active, flowSteps.length - 1)
                        ? "border-[color:var(--rose-burnt)]/20 bg-white/78 opacity-100"
                        : "border-white/60 bg-white/44 opacity-48"
                    }`}
                    style={{
                      left: ["4%", "48%", "10%", "52%"][index],
                      top: ["4%", "22%", "56%", "72%"][index],
                      transform: `translateY(${index === active % flowSteps.length ? -8 : 0}px) rotate(${[-3, 3, -2, 2][index]}deg)`,
                      transitionDelay: `${index * 90}ms`
                    }}
                  >
                    <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[color:var(--rose-burnt)]">{step.label}</p>
                    <p className="mt-2 text-sm font-semibold text-[color:var(--wine)]/70">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[440px] overflow-hidden rounded-[34px] border border-white/70 bg-white/62 p-6 shadow-[0_22px_70px_rgba(103,43,66,0.1)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--mauve)]">resumo depois</p>
                  <h3 className="mt-3 font-serif text-3xl text-[color:var(--wine)]">Informações claras para revisar.</h3>
                </div>
                <span className="rounded-full bg-[color:var(--rose-burnt)]/10 px-3 py-1 text-[0.68rem] font-bold text-[color:var(--wine)]">revisável</span>
              </div>
              <div className="mt-7 grid gap-3">
                {organizedCards.map((card, index) => (
                  <div
                    key={card.label}
                    className={`rounded-[1.35rem] border p-4 transition-all duration-700 ${
                      index <= active ? "translate-x-0 border-[color:var(--rose-burnt)]/18 bg-white/78 opacity-100" : "translate-x-6 border-white/60 bg-white/34 opacity-48"
                    }`}
                    style={{ transitionDelay: `${index * 70}ms` }}
                  >
                    <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[color:var(--rose-burnt)]">{card.label}</p>
                    <p className="mt-2 text-sm font-semibold leading-5 text-[color:var(--ink)]/66">{card.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mt-6 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
            <div className="ai-panel-organize relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(231,176,184,0.16),rgba(188,167,219,0.12))] p-4 shadow-[0_22px_72px_rgba(103,43,66,0.13)]">
              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[color:var(--rose-burnt)]/18 blur-3xl" />
              <div className="absolute left-0 top-0 h-full w-1 bg-[linear-gradient(180deg,rgba(184,101,118,0.75),rgba(188,167,219,0.5),transparent)]" />
              <div className="relative flex items-center justify-between gap-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--rose-burnt)]">Ela organiza</p>
                <span className="rounded-full bg-white/70 px-3 py-1 text-[0.65rem] font-bold text-[color:var(--wine)] shadow-[0_8px_24px_rgba(103,43,66,0.07)]">sequência de cuidado</span>
              </div>
              <div className="relative mt-4 grid gap-2 sm:grid-cols-2">
                {does.map((item, index) => (
                  <span
                    key={item}
                    className="ai-info-card group relative overflow-hidden rounded-[1.1rem] border border-white/75 bg-white/72 px-3.5 py-3 text-[0.82rem] font-bold leading-snug text-[color:var(--wine)] shadow-[0_12px_34px_rgba(103,43,66,0.09)] transition-all duration-500 hover:-translate-y-1.5 hover:rotate-[-0.5deg] hover:bg-white/92 hover:shadow-[0_22px_54px_rgba(103,43,66,0.17)]"
                    style={{ transitionDelay: `${index * 70}ms` }}
                  >
                    <span className="absolute -right-6 -top-8 h-20 w-20 rounded-full bg-[color:var(--rose-burnt)]/10 blur-2xl transition-opacity group-hover:opacity-90" />
                    <span className="relative mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-[linear-gradient(135deg,rgba(184,101,118,0.22),rgba(188,167,219,0.18))] text-[0.62rem] text-[color:var(--rose-burnt)] shadow-inner">{index + 1}</span>
                    <span className="relative">{item}</span>
                  </span>
                ))}
              </div>
              <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-[color:var(--wine)]/8">
                <span className="ai-progress-line block h-full rounded-full bg-[linear-gradient(90deg,rgba(184,101,118,0.82),rgba(188,167,219,0.72),rgba(230,183,126,0.46))]" />
              </div>
            </div>
            <div className="glass-dark ai-panel-limits relative overflow-hidden rounded-[2rem] p-4 text-white shadow-[0_24px_80px_rgba(62,20,44,0.18)]">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-50 blur-3xl" style={{ background: "var(--gradient-brand)" }} />
              <div className="absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-white/8 blur-3xl" />
              <div className="relative flex items-center justify-between gap-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--lavender)]">Limites claros</p>
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[0.65rem] font-bold text-white/72">proteção</span>
              </div>
              <div className="relative mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {doesnt.map((item, index) => (
                  <div
                    key={item}
                    className="ai-limit-card group relative overflow-hidden rounded-[1rem] border border-white/12 bg-white/[0.075] px-3.5 py-3 text-[0.82rem] font-semibold leading-snug text-white/86 transition-all duration-500 hover:-translate-y-1.5 hover:bg-white/[0.14] hover:shadow-[0_18px_48px_rgba(0,0,0,0.14)]"
                    style={{ transitionDelay: `${index * 70}ms` }}
                  >
                    <span className="absolute -right-5 -top-6 h-16 w-16 rounded-full bg-white/10 blur-2xl transition-opacity group-hover:opacity-90" />
                    <span className="relative mb-2 grid h-6 w-6 place-items-center rounded-full border border-white/12 bg-white/10 text-[color:var(--rose-burnt)]">×</span>
                    <span className="relative">{item}</span>
                  </div>
                ))}
              </div>
              <p className="relative mt-5 text-sm leading-6 text-white/60">
                As perguntas sugeridas são apoio para conversar com uma profissional, não uma obrigação para responder.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Reports() {
  const reports = [
    { t: "Ginecologista", d: "Sintomas, histórico e dúvidas estruturados para consulta.", c: "var(--rose-burnt)" },
    { t: "Psicóloga", d: "Sentimentos, contexto e impacto emocional em narrativa cuidadosa.", c: "var(--mauve)" },
    { t: "Registro pessoal", d: "Um diário privado para acompanhar a sua jornada.", c: "var(--lavender)" },
    { t: "Atendimento de urgência", d: "Resumo curto, direto, com sinais físicos, tempo, intensidade e dados essenciais.", c: "var(--wine)" },
    { t: "Situação sensível", d: "Relato delicado organizado sem julgamento, indução ou conclusão.", c: "var(--rose-burnt)" }
  ];

  return (
    <section id="relatorios" className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[color:var(--rose-burnt)]">Cinco formatos</p>
          <h2 className="font-serif text-5xl leading-[1.05] text-[color:var(--ink)] md:text-6xl">
            Um relato. <span className="text-gradient italic">Vários cuidados.</span>
          </h2>
        </div>

        <div className="relative mx-auto mt-24 h-[480px] max-w-4xl">
          {reports.map((report, index) => {
            const rot = (index - 2) * 6;
            const tx = (index - 2) * 60;
            return (
              <div
                key={report.t}
                className="glass group absolute left-1/2 top-1/2 h-[400px] w-[280px] -translate-x-1/2 -translate-y-1/2 cursor-pointer overflow-hidden rounded-[28px] p-6 shadow-2xl transition-all duration-500 hover:!rotate-0 hover:!translate-y-[-60%] hover:z-20 hover:scale-105"
                style={{
                  transform: `translate(calc(-50% + ${tx}px), -50%) rotate(${rot}deg)`,
                  zIndex: 5 - Math.abs(index - 2)
                }}
              >
                <div className="absolute inset-x-6 top-6 h-1.5 rounded-full" style={{ background: `color-mix(in oklab, ${report.c} 70%, transparent)` }} />
                <div className="mt-8">
                  <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: report.c }}>Relatório</p>
                  <h3 className="mt-3 font-serif text-2xl text-[color:var(--ink)]">{report.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--ink)]/65">{report.d}</p>
                </div>
                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  <div className="h-2 w-full rounded-full bg-[color:var(--ink)]/8" />
                  <div className="h-2 w-4/5 rounded-full bg-[color:var(--ink)]/8" />
                  <div className="h-2 w-3/5 rounded-full bg-[color:var(--ink)]/8" />
                </div>
                <div className="absolute -bottom-16 -right-16 h-40 w-40 rounded-full opacity-30 blur-2xl" style={{ background: report.c }} />
              </div>
            );
          })}
        </div>
        <p className="mt-12 text-center text-sm text-[color:var(--ink)]/55">passe o mouse para revelar cada formato</p>
      </div>
    </section>
  );
}

function ReportsMotion() {
  const [active, setActive] = useState(0);
  const reports = [
    { t: "Ginecologista", d: "Sintomas, datas, duração, frequência, intensidade e dúvidas para consulta.", c: "var(--rose-burnt)" },
    { t: "Psicóloga", d: "Sentimentos, vergonha, medo, ansiedade e impacto emocional em linguagem cuidadosa.", c: "var(--mauve)" },
    { t: "Registro pessoal", d: "Um registro privado do que percebeu, sentiu e quer acompanhar.", c: "var(--lavender)" },
    { t: "Atendimento de urgência", d: "Resumo curto, direto, com sinais físicos, tempo, intensidade e dados essenciais.", c: "var(--wine)" },
    { t: "Situação sensível", d: "Relato delicado, emocional ou constrangedor, organizado sem julgamento, indução ou conclusão.", c: "var(--rose-burnt)" }
  ];
  const current = reports[active];

  return (
    <section id="relatorios" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[color:var(--rose-burnt)]">Cinco formatos</p>
          <h2 className="font-serif text-5xl leading-[1.05] text-[color:var(--ink)] md:text-6xl">
            Um relato. <span className="text-gradient italic">Vários cuidados.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="reveal grid gap-3">
            {reports.map((report, index) => (
              <button
                key={report.t}
                type="button"
                onClick={() => setActive(index)}
                className={`report-option group flex items-center gap-4 rounded-[1.5rem] border p-4 text-left shadow-[0_14px_50px_rgba(103,43,66,0.08)] backdrop-blur transition-all ${
                  active === index ? "border-[color:var(--rose-burnt)]/30 bg-white/76" : "border-white/70 bg-white/42 hover:-translate-y-0.5 hover:bg-white/64"
                }`}
                style={{ transitionDelay: `${index * 95}ms` }}
              >
                <span className="h-12 w-12 rounded-[1rem] shadow-glow" style={{ background: `linear-gradient(135deg, ${report.c}, color-mix(in oklab, ${report.c} 45%, white))` }} />
                <span>
                  <strong className="block font-serif text-2xl leading-none text-[color:var(--wine)]">{report.t}</strong>
                  <small className="mt-1 block text-sm leading-5 text-[color:var(--ink)]/58">{report.d}</small>
                </span>
              </button>
            ))}
          </div>

          <div className="reveal relative min-h-[560px] overflow-hidden rounded-[44px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.62),rgba(188,167,219,0.18),rgba(231,176,184,0.16))] p-6 shadow-bloom backdrop-blur-[26px]">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[color:var(--lavender)]/24 blur-3xl" />
            {reports.map((report, index) => {
              const offset = index - active;
              return (
                <div
                  key={report.t}
                  className="report-stack-card absolute left-1/2 top-1/2 h-[440px] w-[74%] max-w-[430px] rounded-[2rem] border border-white/70 bg-white/74 p-7 shadow-[0_30px_90px_rgba(103,43,66,0.16)] backdrop-blur-[22px] transition-all duration-700"
                  style={{
                    transform: `translate(calc(-50% + ${offset * 54}px), calc(-50% + ${Math.abs(offset) * 18}px)) rotate(${offset * 4}deg) scale(${index === active ? 1 : 0.92})`,
                    opacity: Math.abs(offset) > 2 ? 0 : index === active ? 1 : 0.45,
                    zIndex: reports.length - Math.abs(offset),
                    transitionDelay: `${index * 70}ms`
                  }}
                >
                  <div className="absolute inset-x-7 top-7 h-1.5 rounded-full" style={{ background: report.c }} />
                  <p className="mt-8 text-xs font-black uppercase tracking-[0.2em]" style={{ color: report.c }}>Relatório</p>
                  <h3 className="mt-3 font-serif text-4xl leading-none text-[color:var(--ink)]">{report.t}</h3>
                  <p className="mt-4 text-base leading-7 text-[color:var(--ink)]/66">{report.d}</p>
                  <div className="mt-8 space-y-4">
                    {["O que aconteceu", "Quando começou", "Intensidade percebida", "Pontos para consulta"].map((line, lineIndex) => (
                      <div key={line} className="rounded-[1.2rem] bg-[color:var(--cream)]/78 p-4">
                        <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-[color:var(--wine)]/46">{line}</p>
                        <span className="mt-3 block h-2 rounded-full bg-[linear-gradient(90deg,rgba(188,167,219,0.72),rgba(184,101,118,0.66),rgba(230,183,126,0.34))]" style={{ width: `${92 - lineIndex * 12}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
              {reports.map((report, index) => (
                <button key={report.t} type="button" onClick={() => setActive(index)} className={`h-2.5 rounded-full transition-all ${active === index ? "w-9 bg-[color:var(--wine)]" : "w-2.5 bg-[color:var(--wine)]/18"}`} aria-label={`Ver relatório ${report.t}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Specialist() {
  const points = [
    "Não esquecer de mencionar quando começou",
    "Confirmar intensidade e mudanças percebidas",
    "Pedir orientação sobre próximos passos"
  ];
  const questions = [
    "Isso pode estar ligado ao meu ciclo?",
    "Existe algum exame que esclareça melhor?",
    "O que devo observar nas próximas semanas?"
  ];

  return (
    <section className="relative py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="reveal">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[color:var(--mauve)]">Conversa com especialista</p>
          <h2 className="font-serif text-5xl leading-[1.05] text-[color:var(--ink)] md:text-6xl">
            Chegue à consulta <span className="text-gradient italic">com clareza</span>.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-[color:var(--ink)]/70">
            A Ysis prepara uma frase de abertura, pontos para você não esquecer e perguntas sugeridas para levar. Você decide o que usar.
          </p>
        </div>

        <div className="reveal relative">
          <div className="glass relative overflow-hidden rounded-[36px] p-8 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-[color:var(--ink)]/8 pb-4">
              <div className="h-2.5 w-2.5 rounded-full bg-[color:var(--rose-burnt)]/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-[color:var(--lavender)]/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-[color:var(--wine)]/60" />
              <p className="ml-auto text-[10px] uppercase tracking-wider text-[color:var(--ink)]/40">Kit consulta · Ysis</p>
            </div>

            <div className="mt-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--rose-burnt)]">Abertura</p>
              <p className="mt-2 font-serif text-2xl italic leading-snug text-[color:var(--ink)]">
                "Vim porque há algumas semanas venho percebendo mudanças que me preocupam. Trouxe um resumo do que senti."
              </p>
            </div>

            <div className="mt-8">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--mauve)]">Para não esquecer</p>
              <ul className="mt-3 space-y-2">
                {points.map((point) => (
                  <li key={point} className="flex gap-3 rounded-2xl bg-white/50 px-4 py-3 text-sm text-[color:var(--ink)]/80">
                    <span className="text-[color:var(--rose-burnt)]">✦</span>{point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--wine)]">Perguntas sugeridas</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {questions.map((question) => (
                  <span key={question} className="rounded-full border border-[color:var(--wine)]/20 bg-white/60 px-4 py-2 text-sm text-[color:var(--ink)]/80">
                    {question}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpecialistMotion() {
  const [active, setActive] = useState(0);
  const questions = [
    "O que pode ser importante investigar?",
    "Que sinais devo acompanhar?",
    "Quando devo procurar atendimento novamente?",
    "Existe algo que eu deva observar melhor?"
  ];
  const openings = [
    "Tenho um assunto íntimo que me deixou desconfortável e trouxe um resumo para explicar melhor.",
    "Não sei usar termos técnicos, mas percebi algumas mudanças.",
    "Tenho vergonha de falar sobre isso, então preferi organizar antes.",
    "Gostaria de entender quais informações devo acompanhar."
  ];
  const tones = ["mais delicada", "mais objetiva", "mais emocional", "mais prática"];
  const points = ["Quando começou", "Intensidade", "Mudanças percebidas", "Sinais associados", "Contexto emocional", "Dúvidas principais"];
  const kitCards = [
    { label: "Resumo", text: "relato revisável" },
    { label: "Abertura", text: "como começar" },
    { label: "Pontos", text: "não esquecer" },
    { label: "Perguntas", text: "levar à consulta" }
  ];

  useEffect(() => {
    const interval = window.setInterval(() => setActive((current) => (current + 1) % questions.length), 3000);
    return () => window.clearInterval(interval);
  }, [questions.length]);

  return (
    <section className="relative overflow-hidden py-20">
      <div aria-hidden className="absolute -left-28 top-20 h-[420px] w-[420px] rounded-full bg-[color:var(--rose-burnt)]/14 blur-3xl" />
      <div aria-hidden className="absolute -right-28 bottom-8 h-[520px] w-[520px] rounded-full bg-[color:var(--lavender)]/18 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[color:var(--mauve)]">Conversa com especialista</p>
          <h2 className="font-serif text-5xl leading-[1.05] text-[color:var(--ink)] md:text-6xl">
            Chegue à consulta com <span className="text-gradient italic">mais clareza</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--ink)]/70">
            A Ysis ajuda a transformar um relato difícil em uma frase de abertura, pontos para não esquecer e perguntas que podem aproximar a conversa com a profissional.
          </p>
        </div>

        <div className="reveal relative mt-14 overflow-hidden rounded-[48px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.62),rgba(188,167,219,0.18),rgba(231,176,184,0.18))] p-5 shadow-bloom backdrop-blur-[28px] md:p-8">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(103,43,66,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(103,43,66,0.035)_1px,transparent_1px)] bg-[size:38px_38px]" />
          <div className="absolute -right-20 top-20 h-80 w-80 rounded-full bg-[color:var(--rose-burnt)]/18 blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-stretch">
            <div className="relative min-h-[520px] overflow-hidden rounded-[34px] border border-white/70 bg-white/46 p-6 shadow-[0_22px_70px_rgba(103,43,66,0.1)]">
              <div className="absolute -left-16 top-8 h-44 w-44 rounded-full bg-[color:var(--lavender)]/20 blur-3xl" />
              <div className="absolute -right-20 bottom-20 h-56 w-56 rounded-full bg-[color:var(--rose-burnt)]/16 blur-3xl" />
              <h3 className="relative font-serif text-3xl leading-tight text-[color:var(--wine)]">Do “não sei como falar” a uma conversa possível.</h3>
              <div className="relative mt-8 h-[365px]">
                {kitCards.map((card, index) => (
                  <div
                    key={card.label}
                    className={`consult-card absolute rounded-[1.4rem] border border-white/70 bg-white/72 p-4 shadow-[0_16px_50px_rgba(103,43,66,0.1)] transition-all duration-700 ${
                      index <= active ? "opacity-100" : "opacity-50"
                    }`}
                    style={{
                      left: ["4%", "42%", "10%", "48%"][index],
                      top: ["6%", "22%", "54%", "72%"][index],
                      transform: `translateY(${index === active ? -10 : 0}px) rotate(${[-4, 5, -2, 3][index]}deg)`
                    }}
                  >
                    <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[color:var(--mauve)]">{card.label}</p>
                    <p className="mt-2 font-serif text-xl text-[color:var(--wine)]">{card.text}</p>
                  </div>
                ))}
                <div aria-hidden className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-[44%_56%_52%_48%/56%_42%_58%_44%] bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.86),rgba(188,167,219,0.32),rgba(184,101,118,0.16),transparent_72%)] blur-[1px] shadow-[0_22px_70px_rgba(103,43,66,0.12)]" />
                <div aria-hidden className="absolute left-[16%] right-[16%] top-1/2 h-px bg-[linear-gradient(90deg,transparent,rgba(103,43,66,0.22),transparent)]" />
                <div aria-hidden className="absolute bottom-10 left-1/2 h-16 w-56 -translate-x-1/2 rounded-full bg-white/26 blur-2xl" />
                </div>
              <p className="relative rounded-[1.3rem] border border-white/70 bg-white/58 p-4 text-sm font-semibold leading-6 text-[color:var(--wine)] shadow-veil backdrop-blur">
                Você decide o que usar. Nada é enviado automaticamente.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-white/64 p-5 shadow-[0_22px_70px_rgba(103,43,66,0.12)] md:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--wine)]/8 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--rose-burnt)]/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--lavender)]/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--wine)]/70" />
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--ink)]/42">Kit consulta · Ysis</p>
              </div>
              <div className="mt-7 grid gap-5 lg:grid-cols-[1.04fr_0.96fr]">
                <div className="rounded-[1.7rem] border border-white/70 bg-[color:var(--cream)]/68 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--rose-burnt)]">Frase de abertura</p>
                    <span className="rounded-full bg-white/70 px-3 py-1 text-[0.65rem] font-bold text-[color:var(--wine)]">{tones[active]}</span>
                  </div>
                  <p className="ysis-type-in mt-4 font-serif text-3xl italic leading-snug text-[color:var(--ink)]" key={openings[active]}>
                    {`"${openings[active]}"`}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {tones.map((tone, index) => (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => setActive(index)}
                        className={`rounded-full px-3 py-1.5 text-[0.68rem] font-bold transition-all ${index === active ? "bg-[color:var(--wine)] text-white" : "bg-white/62 text-[color:var(--wine)]/60"}`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.7rem] border border-white/70 bg-white/58 p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--mauve)]">Pontos para não esquecer</p>
                  <div className="mt-4 grid gap-2">
                    {points.map((point, index) => (
                      <div
                        key={point}
                        className={`flex items-center gap-3 rounded-[1rem] px-3 py-2.5 text-sm font-bold transition-all duration-500 ${
                          index <= active + 2 ? "translate-x-0 bg-white/76 text-[color:var(--wine)] opacity-100" : "translate-x-5 bg-white/35 text-[color:var(--wine)]/46 opacity-55"
                        }`}
                        style={{ transitionDelay: `${index * 70}ms` }}
                      >
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-[color:var(--rose-burnt)]/12 text-[0.65rem]">✓</span>
                        {point}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[1.7rem] border border-white/70 bg-white/58 p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--rose-burnt)]">Resumo revisável</p>
                  <div className="mt-4 space-y-2">
                    {[88, 68, 94, 78].map((width, index) => (
                      <span key={width} className="block h-2 rounded-full bg-[linear-gradient(90deg,rgba(188,167,219,0.72),rgba(184,101,118,0.58),rgba(230,183,126,0.28))]" style={{ width: `${width}%`, transitionDelay: `${index * 90}ms` }} />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[color:var(--ink)]/62">
                    O resumo vira apoio para fala, não uma decisão automática.
                  </p>
                </div>

                <div className="relative min-h-[218px] overflow-hidden rounded-[1.7rem] border border-[color:var(--wine)]/10 bg-white/68 p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--mauve)]">Perguntas sugeridas</p>
                  <div className="relative mt-4 min-h-[74px]">
                    {questions.map((question, index) => (
                      <p
                        key={question}
                        className={`absolute inset-x-0 text-xl font-semibold leading-7 text-[color:var(--wine)] transition-all duration-700 ${
                          index === active ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                        }`}
                      >
                        {question}
                      </p>
                    ))}
                  </div>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {questions.map((question, index) => (
                      <button key={question} type="button" onClick={() => setActive(index)} className={`h-2.5 rounded-full transition-all ${index === active ? "w-10 bg-[color:var(--wine)]" : "w-2.5 bg-[color:var(--wine)]/20"}`} aria-label={`Ver pergunta ${index + 1}`} />
                    ))}
                  </div>
                  <p className="mt-5 text-sm leading-6 text-[color:var(--ink)]/62">
                    As perguntas não são obrigatórias dentro da ferramenta. São sugestões para levar ao especialista.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Privacy() {
  const items = [
    { n: "01", t: "Áudio não salvo", d: "Por padrão, o áudio é descartado após a transcrição." },
    { n: "02", t: "Revisão antes do resumo", d: "Nada é gerado sem você ler e aprovar." },
    { n: "03", t: "Histórico apagável", d: "Você apaga o que quiser, quando quiser." },
    { n: "04", t: "Modo discreto", d: "Interface neutra para usar em qualquer lugar." },
    { n: "05", t: "Nada enviado sozinho", d: "Nenhum relato sai daqui sem sua decisão." }
  ];

  return (
    <section id="privacidade" className="relative mx-4 my-12 overflow-hidden rounded-[48px] py-20 md:mx-8" style={{ background: "linear-gradient(160deg, oklch(0.2 0.07 350), oklch(0.32 0.1 350) 60%, oklch(0.45 0.13 340))" }}>
      <div aria-hidden className="absolute inset-0">
        <div className="absolute -top-40 left-1/4 h-[400px] w-[400px] rounded-full opacity-30 blur-3xl" style={{ background: "var(--gradient-brand)" }} />
        <div className="absolute -bottom-40 right-10 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl" style={{ background: "oklch(0.78 0.1 310)" }} />
      </div>
      <div className="relative mx-auto max-w-7xl px-8 text-white">
        <div className="reveal max-w-3xl">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[color:var(--lavender)]">Privacidade</p>
          <h2 className="font-serif text-5xl leading-[1.05] md:text-6xl">
            O cuidado começa em <span className="italic text-[color:var(--lavender)]">proteger o que é seu</span>.
          </h2>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
          {items.map((item, index) => (
            <div key={item.n} className="reveal rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur" style={{ transitionDelay: `${index * 80}ms` }}>
              <p className="font-serif text-5xl text-outline" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.4)" }}>{item.n}</p>
              <h3 className="mt-4 font-serif text-xl">{item.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{item.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrivacyMotion() {
  const items = [
    { n: "01", t: "Áudio não salvo", d: "O áudio é usado para transcrever e descartado por padrão." },
    { n: "02", t: "Revisão antes do resumo", d: "Nada é finalizado sem a usuária ler e ajustar." },
    { n: "03", t: "Histórico apagável", d: "Relatos e relatórios podem ser removidos." },
    { n: "04", t: "Modo discreto", d: "Interface neutra para reduzir exposição." },
    { n: "05", t: "Nada enviado sozinho", d: "Compartilhar depende de decisão explícita." },
    { n: "06", t: "Controle do relato", d: "Salvar, copiar, exportar ou apagar fica com a usuária." }
  ];

  return (
    <section id="privacidade" className="relative mx-4 my-12 overflow-hidden rounded-[48px] py-20 md:mx-8" style={{ background: "linear-gradient(160deg, oklch(0.2 0.07 350), oklch(0.32 0.1 350) 60%, oklch(0.45 0.13 340))" }}>
      <div aria-hidden className="absolute inset-0">
        <div className="absolute -top-40 left-1/4 h-[400px] w-[400px] rounded-full opacity-30 blur-3xl" style={{ background: "var(--gradient-brand)" }} />
        <div className="absolute -bottom-40 right-10 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl" style={{ background: "oklch(0.78 0.1 310)" }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:46px_46px] opacity-40" />
      </div>
      <div className="relative mx-auto max-w-7xl px-8 text-white">
        <div className="reveal flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[color:var(--lavender)]">Privacidade</p>
            <h2 className="font-serif text-5xl leading-[1.05] md:text-6xl">
              O cuidado começa em <span className="italic text-[color:var(--lavender)]">proteger o que é seu</span>.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/62">
            Você decide o que grava, escreve, revisa, salva, apaga ou compartilha. Relatos sensíveis pedem privacidade, consentimento e controle.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div key={item.n} className="reveal group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] p-6 backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.09]" style={{ transitionDelay: `${index * 70}ms` }}>
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl transition-opacity group-hover:opacity-80" />
              <p className="font-serif text-5xl text-outline" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.42)" }}>{item.n}</p>
              <h3 className="mt-4 font-serif text-2xl">{item.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{item.d}</p>
              <span className="mt-5 block h-1 w-12 rounded-full bg-[linear-gradient(90deg,rgba(188,167,219,0.9),rgba(231,176,184,0.7))]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Community() {
  const groups = ["ONGs", "Escolas", "Universidades", "UBS", "Clínicas populares", "Unidades móveis", "Centros da mulher", "Projetos de extensão"];
  const flow = ["ponto de acolhimento", "voz ou texto", "relato organizado", "consentimento", "profissional parceira"];

  return (
    <section id="comunidade" className="relative py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
        <div className="reveal">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[color:var(--rose-burnt)]">Ysis Comunidade</p>
          <h2 className="font-serif text-5xl leading-[1.05] text-[color:var(--ink)] md:text-6xl">
            Acolhimento que chega <span className="text-gradient italic">onde precisa estar</span>.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[color:var(--ink)]/70">
            A Ysis pode ser adaptada para ações sociais, escolas, ONGs, UBS, centros comunitários, unidades móveis e projetos de extensão. Uma equipe parceira ajuda a mulher a relatar por voz ou texto, organizar o resumo e, com consentimento, encaminhar para uma profissional orientar próximos passos.
          </p>
          <p className="mt-4 max-w-xl text-sm font-semibold leading-6 text-[color:var(--wine)]">
            Não é diagnóstico remoto automático. É triagem acolhedora e organização de relatos para facilitar acesso ao cuidado profissional.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {groups.map((group) => (
              <span key={group} className="glass rounded-full px-4 py-2 text-sm text-[color:var(--wine)]">{group}</span>
            ))}
          </div>
        </div>

        <div className="reveal relative h-[520px] overflow-hidden rounded-[42px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.62),rgba(188,167,219,0.16),rgba(231,176,184,0.16))] p-6 shadow-bloom backdrop-blur-[26px]">
          <NetworkSvg />
          <div className="absolute bottom-6 left-6 right-6 grid gap-3">
            {flow.map((item, index) => (
              <div key={item} className="glass flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-sm font-bold text-[color:var(--wine)] shadow-[0_12px_36px_rgba(103,43,66,0.08)]" style={{ transform: `translateX(${index % 2 ? 22 : 0}px)` }}>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[color:var(--rose-burnt)]/12 text-[0.7rem]">0{index + 1}</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NetworkSvg() {
  const nodes = [
    { x: 50, y: 50, r: 18 },
    { x: 20, y: 25, r: 10 },
    { x: 80, y: 20, r: 12 },
    { x: 15, y: 70, r: 11 },
    { x: 85, y: 75, r: 13 },
    { x: 50, y: 85, r: 9 },
    { x: 35, y: 15, r: 7 },
    { x: 70, y: 50, r: 8 },
    { x: 30, y: 55, r: 7 }
  ];

  return (
    <svg viewBox="0 0 100 100" className="anim-spin-slow h-full w-full">
      <defs>
        <linearGradient id="ng" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="oklch(0.78 0.1 310)" />
          <stop offset="0.5" stopColor="oklch(0.68 0.14 25)" />
          <stop offset="1" stopColor="oklch(0.32 0.1 350)" />
        </linearGradient>
      </defs>
      {nodes.slice(1).map((node, index) => (
        <line key={index} x1={nodes[0].x} y1={nodes[0].y} x2={node.x} y2={node.y} stroke="url(#ng)" strokeWidth="0.3" opacity="0.5" />
      ))}
      {nodes.map((node, index) => (
        <circle key={index} cx={node.x} cy={node.y} r={node.r / 6} fill="url(#ng)" opacity={index === 0 ? 1 : 0.7} />
      ))}
    </svg>
  );
}

function FinalCTA() {
  return (
    <section id="cta" className="relative py-24">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl" style={{ background: "var(--gradient-brand)" }} />
      </div>
      <div className="reveal mx-auto max-w-5xl px-6 text-center">
        <img src={orbSrc} alt="" aria-hidden className="anim-spin-slow mx-auto h-32 w-32 opacity-90" />
        <h2 className="mt-8 font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[1] text-[color:var(--ink)]">
          Você não precisa saber explicar tudo agora.<br />
          <span className="text-gradient italic">Comece do seu jeito.</span>
        </h2>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <a href="/ferramenta" className="bg-gradient-brand group inline-flex items-center gap-2 rounded-full px-8 py-5 text-base font-medium text-white shadow-2xl shadow-[color:var(--wine)]/30 transition-transform hover:scale-[1.04]">
            Começar meu relato
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a href="#solucao" className="inline-flex items-center gap-2 rounded-full border border-[color:var(--wine)]/30 bg-white/40 px-8 py-5 text-base font-medium text-[color:var(--wine)] backdrop-blur hover:bg-white/70">
            Ver como funciona
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[color:var(--wine)]/10 bg-white/40 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-3">
          <img src={logoSrc} alt="Ysis" className="h-10 w-10 rounded-full" />
          <div>
            <p className="font-serif text-2xl text-[color:var(--wine)]">Ysis</p>
            <p className="text-xs text-[color:var(--ink)]/55">Tecnologia que acolhe, cuidado que transforma.</p>
          </div>
        </div>
        <div className="max-w-md text-xs leading-relaxed text-[color:var(--ink)]/55">
          A Ysis não diagnostica, não prescreve e não substitui profissionais de saúde.
          As perguntas geradas são sugestões para você levar ao especialista, não obrigações para responder.
        </div>
        <div className="flex flex-col gap-2 text-sm text-[color:var(--ink)]/70">
          <a href="#solucao" className="hover:text-[color:var(--wine)]">Solução</a>
          <a href="#jornada" className="hover:text-[color:var(--wine)]">Jornada</a>
          <a href="#privacidade" className="hover:text-[color:var(--wine)]">Privacidade</a>
          <a href="#comunidade" className="hover:text-[color:var(--wine)]">Comunidade</a>
        </div>
      </div>
      <div className="border-t border-[color:var(--wine)]/10 py-4 text-center text-[10px] uppercase tracking-[0.2em] text-[color:var(--ink)]/40">
        © {new Date().getFullYear()} Ysis · Feito com cuidado
      </div>
    </footer>
  );
}

export function LandingPage() {
  useReveal();

  return (
    <main className="lovable-root relative min-h-screen overflow-x-clip">
      <BgAuroras />
      <Nav />
      <Hero />
      <Problem />
      <SolutionMotion />
      <JourneyAuto />
      <AISectionMotion />
      <ReportsMotion />
      <SpecialistMotion />
      <PrivacyMotion />
      <Community />
      <FinalCTA />
      <Footer />
    </main>
  );
}




