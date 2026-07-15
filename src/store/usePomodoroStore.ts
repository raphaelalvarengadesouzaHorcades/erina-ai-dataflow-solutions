import { create } from "zustand";

/* ------------------------------------------------------------------ */
/* Constantes                                                          */
/* ------------------------------------------------------------------ */

/** Duração do bloco de foco, em segundos (20 min). */
export const DURACAO_FOCO = 20 * 60; // 1200s
/** Duração da pausa, em segundos (5 min). */
export const DURACAO_PAUSA = 5 * 60; // 300s

export type ModoPomodoro = "foco" | "pausa";

/** Duração (em segundos) de cada modo. */
export function duracaoDoModo(modo: ModoPomodoro): number {
  return modo === "foco" ? DURACAO_FOCO : DURACAO_PAUSA;
}

/* ------------------------------------------------------------------ */
/* "Ding" curto via Web Audio (opcional, tolerante a falhas)           */
/* ------------------------------------------------------------------ */

function tocarDing(): void {
  try {
    const w = window as unknown as {
      AudioContext?: typeof AudioContext;
      webkitAudioContext?: typeof AudioContext;
    };
    const Ctx = w.AudioContext ?? w.webkitAudioContext;
    if (!Ctx) return;

    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);

    // Envelope curto para um "ding" agradável.
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);

    // Fecha o contexto após o som para não vazar recursos.
    osc.onended = () => {
      try {
        void ctx.close();
      } catch {
        /* ignora */
      }
    };
  } catch {
    /* Sem áudio disponível — segue sem som. */
  }
}

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

export interface PomodoroState {
  /* --- estado --- */
  modo: ModoPomodoro;
  segundosRestantes: number;
  rodando: boolean;
  /** Quantidade de blocos de foco concluídos. */
  ciclos: number;
  /** Widget expandido (true) x pílula minimizada (false). */
  aberto: boolean;
  /** Widget visível na tela (false = escondido/fechado). */
  visivel: boolean;

  /* --- ações do timer --- */
  iniciar: () => void;
  pausar: () => void;
  resetar: () => void;
  /** Alterna foco↔pausa manualmente, zerando o timer do novo modo. */
  pular: () => void;
  /** Decrementa 1 segundo; ao zerar, troca de modo (e conta ciclo no foco). */
  tick: () => void;

  /* --- ações de layout --- */
  expandir: () => void;
  minimizar: () => void;
  toggleAberto: () => void;
  mostrar: () => void;
  esconder: () => void;
}

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  modo: "foco",
  segundosRestantes: DURACAO_FOCO,
  rodando: false,
  ciclos: 0,
  aberto: false,
  visivel: true,

  iniciar: () => set({ rodando: true }),

  pausar: () => set({ rodando: false }),

  resetar: () =>
    set((s) => ({
      rodando: false,
      segundosRestantes: duracaoDoModo(s.modo),
    })),

  pular: () =>
    set((s) => {
      const proximo: ModoPomodoro = s.modo === "foco" ? "pausa" : "foco";
      return {
        modo: proximo,
        segundosRestantes: duracaoDoModo(proximo),
        rodando: false,
      };
    }),

  tick: () => {
    const { segundosRestantes, modo, ciclos } = get();

    // Ainda há tempo: apenas decrementa.
    if (segundosRestantes > 1) {
      set({ segundosRestantes: segundosRestantes - 1 });
      return;
    }

    // Chegou a zero: troca de modo.
    tocarDing();

    if (modo === "foco") {
      set({
        modo: "pausa",
        segundosRestantes: DURACAO_PAUSA,
        ciclos: ciclos + 1,
        rodando: true,
      });
    } else {
      set({
        modo: "foco",
        segundosRestantes: DURACAO_FOCO,
        rodando: true,
      });
    }
  },

  expandir: () => set({ aberto: true }),
  minimizar: () => set({ aberto: false }),
  toggleAberto: () => set((s) => ({ aberto: !s.aberto })),
  mostrar: () => set({ visivel: true }),
  esconder: () => set({ visivel: false }),
}));
