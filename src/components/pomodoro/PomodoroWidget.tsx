"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Minimize2,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  usePomodoroStore,
  duracaoDoModo,
  type ModoPomodoro,
} from "@/store/usePomodoroStore";
import {
  abrirJanelaFlutuante,
  pipDisponivel,
  formatMMSS,
} from "./pip";

/* ------------------------------------------------------------------ */
/* Anel de progresso (SVG)                                             */
/* ------------------------------------------------------------------ */

function AnelProgresso({
  progresso,
  acento,
  children,
}: {
  /** 0 → 1 (fração de tempo restante). */
  progresso: number;
  /** Classe de cor do traço (ex.: "text-primary"). */
  acento: string;
  children: React.ReactNode;
}) {
  const raio = 52;
  const circunferencia = 2 * Math.PI * raio;
  const clamp = Math.max(0, Math.min(1, progresso));
  const offset = circunferencia * (1 - clamp);

  return (
    <div className="relative flex items-center justify-center">
      <svg width={128} height={128} viewBox="0 0 128 128" className="-rotate-90">
        <circle
          cx={64}
          cy={64}
          r={raio}
          fill="none"
          strokeWidth={8}
          className="stroke-border-soft"
        />
        <circle
          cx={64}
          cy={64}
          r={raio}
          fill="none"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          strokeDashoffset={offset}
          className={cn("transition-[stroke-dashoffset] duration-1000 ease-linear", acento)}
          stroke="currentColor"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Botão de ação circular                                              */
/* ------------------------------------------------------------------ */

function BotaoAcao({
  onClick,
  titulo,
  primario,
  children,
}: {
  onClick: () => void;
  titulo: string;
  primario?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={titulo}
      aria-label={titulo}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full border transition active:scale-95",
        primario
          ? "border-transparent bg-primary text-white hover:brightness-110"
          : "border-border-soft bg-card text-ink hover:bg-primary-light",
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Widget principal                                                    */
/* ------------------------------------------------------------------ */

export function PomodoroWidget() {
  const pathname = usePathname();

  const modo = usePomodoroStore((s) => s.modo);
  const segundosRestantes = usePomodoroStore((s) => s.segundosRestantes);
  const rodando = usePomodoroStore((s) => s.rodando);
  const ciclos = usePomodoroStore((s) => s.ciclos);
  const aberto = usePomodoroStore((s) => s.aberto);
  const visivel = usePomodoroStore((s) => s.visivel);

  const iniciar = usePomodoroStore((s) => s.iniciar);
  const pausar = usePomodoroStore((s) => s.pausar);
  const resetar = usePomodoroStore((s) => s.resetar);
  const pular = usePomodoroStore((s) => s.pular);
  const tick = usePomodoroStore((s) => s.tick);
  const expandir = usePomodoroStore((s) => s.expandir);
  const minimizar = usePomodoroStore((s) => s.minimizar);
  const esconder = usePomodoroStore((s) => s.esconder);

  // Suporte a PiP é resolvido só no cliente (evita divergência de hidratação).
  const [temPip, setTemPip] = useState(false);
  useEffect(() => {
    setTemPip(pipDisponivel());
  }, []);

  // Loop de 1s — um único interval, apenas enquanto rodando.
  useEffect(() => {
    if (!rodando) return;
    const id = window.setInterval(() => {
      tick();
    }, 1000);
    return () => window.clearInterval(id);
  }, [rodando, tick]);

  const ehFoco = modo === "foco";
  const acentoTexto = ehFoco ? "text-primary" : "text-success";
  const rotulo = ehFoco ? "Foco" : "Pausa";

  const progresso = useMemo(() => {
    const total = duracaoDoModo(modo);
    return total > 0 ? segundosRestantes / total : 0;
  }, [modo, segundosRestantes]);

  const tempo = formatMMSS(segundosRestantes);

  // Nunca renderiza na tela de login.
  if (pathname === "/login") return null;
  if (!visivel) return null;

  /* --- Pílula minimizada --- */
  if (!aberto) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <div className="flex items-center gap-2 rounded-full border border-border-soft bg-card py-1.5 pl-3 pr-1.5 shadow-lg">
          <button
            type="button"
            onClick={expandir}
            title="Expandir Pomodoro"
            className="flex items-center gap-2"
          >
            <span aria-hidden>🍅</span>
            <span
              className={cn(
                "text-sm font-semibold tabular-nums",
                acentoTexto,
              )}
            >
              {tempo}
            </span>
          </button>
          <button
            type="button"
            onClick={() => (rodando ? pausar() : iniciar())}
            title={rodando ? "Pausar" : "Iniciar"}
            aria-label={rodando ? "Pausar" : "Iniciar"}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition hover:brightness-110 active:scale-95"
          >
            {rodando ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
          </button>
        </div>
      </div>
    );
  }

  /* --- Card expandido --- */
  return (
    <div className="fixed bottom-4 right-4 z-40 w-64">
      <div className="rounded-2xl border border-border-soft bg-card p-4 shadow-xl">
        {/* Cabeçalho */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span aria-hidden>🍅</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                ehFoco
                  ? "bg-primary-light text-primary"
                  : "bg-success-light text-success",
              )}
            >
              {rotulo}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={minimizar}
              title="Minimizar"
              aria-label="Minimizar"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition hover:bg-primary-light hover:text-ink"
            >
              <Minimize2 size={15} />
            </button>
            <button
              type="button"
              onClick={esconder}
              title="Fechar"
              aria-label="Fechar"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition hover:bg-danger-light hover:text-danger"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Anel + tempo */}
        <div className="flex justify-center py-1">
          <AnelProgresso progresso={progresso} acento={acentoTexto}>
            <span className="text-3xl font-bold tabular-nums text-ink">
              {tempo}
            </span>
            <span className="mt-0.5 text-[11px] font-medium text-muted">
              {ehFoco ? "concentre-se" : "respire"}
            </span>
          </AnelProgresso>
        </div>

        {/* Ciclos concluídos */}
        <div className="mt-3 flex items-center justify-center gap-1">
          <PontosCiclos ciclos={ciclos} modo={modo} />
        </div>

        {/* Controles */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <BotaoAcao onClick={resetar} titulo="Resetar">
            <RotateCcw size={17} />
          </BotaoAcao>
          <BotaoAcao
            onClick={() => (rodando ? pausar() : iniciar())}
            titulo={rodando ? "Pausar" : "Iniciar"}
            primario
          >
            {rodando ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </BotaoAcao>
          <BotaoAcao onClick={pular} titulo="Pular etapa">
            <SkipForward size={17} />
          </BotaoAcao>
        </div>

        {/* Janela flutuante (PiP) */}
        <button
          type="button"
          onClick={() => {
            void abrirJanelaFlutuante();
          }}
          disabled={!temPip}
          title={
            temPip
              ? "Abrir em janela flutuante sempre-no-topo"
              : "Disponível no Chrome/Edge"
          }
          className={cn(
            "mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border-soft py-2 text-xs font-semibold transition",
            temPip
              ? "text-ink hover:bg-primary-light"
              : "cursor-not-allowed text-muted opacity-60",
          )}
        >
          <ExternalLink size={14} />
          Janela flutuante
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pontinhos de ciclos concluídos                                      */
/* ------------------------------------------------------------------ */

function PontosCiclos({
  ciclos,
  modo,
}: {
  ciclos: number;
  modo: ModoPomodoro;
}) {
  // Mostra os ciclos do "bloco" atual de 4; acima disso, some com contador.
  const naSerie = ciclos % 4 === 0 && ciclos > 0 ? 4 : ciclos % 4;
  const series = Math.floor((ciclos - (naSerie === 4 ? 1 : 0)) / 4);

  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-2 w-2 rounded-full transition-colors",
            i < naSerie
              ? modo === "foco"
                ? "bg-primary"
                : "bg-success"
              : "bg-border-soft",
          )}
        />
      ))}
      {series > 0 && (
        <span className="ml-1 text-[11px] font-medium text-muted">
          +{series * 4}
        </span>
      )}
    </div>
  );
}
