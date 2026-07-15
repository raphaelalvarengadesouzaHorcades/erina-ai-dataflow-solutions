import { create } from "zustand";

/* ------------------------------------------------------------------ */
/* Tipos públicos                                                      */
/* ------------------------------------------------------------------ */

export interface Selo {
  id: string;
  nome: string;
  emoji: string;
  descricao: string;
  conquistado: boolean;
}

export interface HabitosDoDia {
  aguas: number;
  alongamentos: number;
  pausas: number;
}

/**
 * Um time de bem-estar que participa do ranking saudável.
 * Os contadores são a soma dos hábitos registrados por todos os membros.
 */
export interface TimeBemEstar {
  id: string;
  nome: string;
  emoji: string;
  membros: number;
  aguas: number;
  alongamentos: number;
  pausas: number;
  /** Marca o time da própria usuária (Mariana) para destaque na tela. */
  ehMeuTime?: boolean;
}

/** Time (já com pontos e posição calculados) pronto para exibir no ranking. */
export interface TimeRanqueado extends TimeBemEstar {
  pontos: number;
  posicao: number;
}

/** Metas diárias de cada hábito — usadas nas barrinhas de progresso. */
export const METAS_HABITOS = {
  aguas: 8,
  alongamentos: 4,
  pausas: 3,
} as const;

/** Pontos concedidos por cada tipo de registro. */
export const PONTOS_POR_HABITO = {
  agua: 10,
  alongamento: 15,
  pausa: 20,
} as const;

/** Quantidade de XP necessária para completar cada nível. */
export const XP_POR_NIVEL = 500;

export interface GamificacaoState {
  /* --- estado --- */
  pontos: number;
  streakDias: number;
  nivel: number;
  xp: number;
  habitos: HabitosDoDia;
  selos: Selo[];
  times: TimeBemEstar[];

  /* --- ações --- */
  registrarAgua: () => void;
  registrarAlongamento: () => void;
  registrarPausa: () => void;
  resetarDia: () => void;
}

/* ------------------------------------------------------------------ */
/* Selectors / derivados (funções puras)                               */
/* ------------------------------------------------------------------ */

export type GamificacaoSnapshot = Pick<
  GamificacaoState,
  "pontos" | "nivel" | "xp" | "streakDias" | "habitos"
>;

/** Progresso rumo ao próximo nível, normalizado 0..1. */
export function getProgressoNivel(state: GamificacaoSnapshot): number {
  return Math.min(1, Math.max(0, state.xp / XP_POR_NIVEL));
}

/** Quantos pontos de XP ainda faltam para o próximo nível. */
export function getXpRestante(state: GamificacaoSnapshot): number {
  return Math.max(0, XP_POR_NIVEL - state.xp);
}

/**
 * Estágio do mascote (0..4) coerente com o nível atual.
 * 0 = broto, 4 = plantinha florida e feliz.
 */
export function getEstagioMascote(state: GamificacaoSnapshot): number {
  return Math.min(4, Math.max(0, state.nivel - 1));
}

/** Pontos de bem-estar de um time = soma dos hábitos saudáveis registrados. */
export function getPontosTime(time: TimeBemEstar): number {
  return (
    time.aguas * PONTOS_POR_HABITO.agua +
    time.alongamentos * PONTOS_POR_HABITO.alongamento +
    time.pausas * PONTOS_POR_HABITO.pausa
  );
}

/**
 * Ordena os times por pontos (desc) e atribui a posição no ranking (1 = líder).
 */
export function getRankingTimes(times: TimeBemEstar[]): TimeRanqueado[] {
  return times
    .map((time) => ({ ...time, pontos: getPontosTime(time) }))
    .sort((a, b) => b.pontos - a.pontos)
    .map((time, i) => ({ ...time, posicao: i + 1 }));
}

export interface InfoMeuTime {
  meuTime: TimeRanqueado;
  /** Time imediatamente acima no ranking (null se já for o líder). */
  timeAcima: TimeRanqueado | null;
  /** Pontos que faltam para ultrapassar o time de cima (0 se for líder). */
  pontosParaSubir: number;
  /** Pontos totais do time líder — útil para a barra de comparação. */
  pontosLider: number;
}

/**
 * Resume a situação do time da usuária: posição, quem está logo acima e
 * quantos pontos faltam para ultrapassá-lo. Base do cartão motivador da Erina.
 */
export function getInfoMeuTime(times: TimeBemEstar[]): InfoMeuTime | null {
  const ranking = getRankingTimes(times);
  const idx = ranking.findIndex((t) => t.ehMeuTime);
  if (idx === -1) return null;
  const meuTime = ranking[idx];
  const timeAcima = idx > 0 ? ranking[idx - 1] : null;
  const pontosParaSubir = timeAcima
    ? Math.max(0, timeAcima.pontos - meuTime.pontos + 1)
    : 0;
  return {
    meuTime,
    timeAcima,
    pontosParaSubir,
    pontosLider: ranking[0]?.pontos ?? meuTime.pontos,
  };
}

/* ------------------------------------------------------------------ */
/* Helpers internos                                                    */
/* ------------------------------------------------------------------ */

/**
 * Aplica ganho de XP/pontos e faz o "level up" acumulando o excedente.
 */
function aplicarGanho(
  state: GamificacaoState,
  pontosGanhos: number,
): Pick<GamificacaoState, "pontos" | "xp" | "nivel"> {
  const pontos = state.pontos + pontosGanhos;
  let xp = state.xp + pontosGanhos;
  let nivel = state.nivel;
  while (xp >= XP_POR_NIVEL) {
    xp -= XP_POR_NIVEL;
    nivel += 1;
  }
  return { pontos, xp, nivel };
}

/**
 * Marca um selo como conquistado (imutável) caso ainda não esteja.
 */
function conquistarSelo(selos: Selo[], id: string): Selo[] {
  let mudou = false;
  const novos = selos.map((s) => {
    if (s.id === id && !s.conquistado) {
      mudou = true;
      return { ...s, conquistado: true };
    }
    return s;
  });
  return mudou ? novos : selos;
}

/* ------------------------------------------------------------------ */
/* Estado inicial                                                      */
/* ------------------------------------------------------------------ */

const SELOS_INICIAIS: Selo[] = [
  {
    id: "hidratada",
    nome: "Hidratada",
    emoji: "💧",
    descricao: "Bebeu água 5 vezes em um único dia.",
    conquistado: true,
  },
  {
    id: "pausa-consciente",
    nome: "Pausa Consciente",
    emoji: "☕",
    descricao: "Fez pausas de verdade, longe da tela.",
    conquistado: true,
  },
  {
    id: "corpo-em-movimento",
    nome: "Corpo em Movimento",
    emoji: "🧘",
    descricao: "Alongou o corpo ao longo da jornada.",
    conquistado: true,
  },
  {
    id: "semana-saudavel",
    nome: "Semana Saudável",
    emoji: "🌿",
    descricao: "Manteve seus hábitos por 7 dias seguidos.",
    conquistado: true,
  },
  {
    id: "sem-burnout",
    nome: "Sem Burnout",
    emoji: "🛡️",
    descricao: "Respeitou seus limites e não estendeu a jornada.",
    conquistado: false,
  },
  {
    id: "jornada-respeitada",
    nome: "Jornada Respeitada",
    emoji: "⏰",
    descricao: "Encerrou o expediente no horário por 5 dias.",
    conquistado: false,
  },
  {
    id: "mestre-do-descanso",
    nome: "Mestre do Descanso",
    emoji: "🌙",
    descricao: "Desconectou de verdade após o expediente.",
    conquistado: false,
  },
  {
    id: "guardiao-do-bem-estar",
    nome: "Guardião do Bem-estar",
    emoji: "🏆",
    descricao: "Alcançou o nível 5 cuidando de você.",
    conquistado: false,
  },
];

/**
 * Times de bem-estar (dados mockados). Os contadores viram pontos via
 * getPontosTime, então a ordem do ranking sai do próprio hábito saudável.
 * "Time Produto" é o time da Mariana (ehMeuTime) e ganha destaque na tela.
 */
const TIMES_INICIAIS: TimeBemEstar[] = [
  {
    id: "dados",
    nome: "Time Dados",
    emoji: "📊",
    membros: 6,
    aguas: 50,
    alongamentos: 24,
    pausas: 35,
  },
  {
    id: "design",
    nome: "Time Design",
    emoji: "🎨",
    membros: 5,
    aguas: 44,
    alongamentos: 20,
    pausas: 27,
  },
  {
    id: "produto",
    nome: "Time Produto",
    emoji: "🚀",
    membros: 5,
    aguas: 40,
    alongamentos: 16,
    pausas: 30,
    ehMeuTime: true,
  },
  {
    id: "backend",
    nome: "Time Backend",
    emoji: "⚙️",
    membros: 7,
    aguas: 30,
    alongamentos: 20,
    pausas: 25,
  },
  {
    id: "qa",
    nome: "Time QA",
    emoji: "🔍",
    membros: 4,
    aguas: 30,
    alongamentos: 12,
    pausas: 25,
  },
];

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

export const useGamificacaoStore = create<GamificacaoState>((set) => ({
  /* --- estado inicial --- */
  pontos: 1240,
  streakDias: 7,
  nivel: 3,
  xp: 240,
  habitos: {
    aguas: 5,
    alongamentos: 2,
    pausas: 2,
  },
  selos: SELOS_INICIAIS,
  times: TIMES_INICIAIS,

  /* --- ações --- */
  registrarAgua: () =>
    set((state) => {
      const aguas = state.habitos.aguas + 1;
      const ganho = aplicarGanho(state, PONTOS_POR_HABITO.agua);
      let selos = state.selos;
      if (aguas >= 5) selos = conquistarSelo(selos, "hidratada");
      if (ganho.nivel >= 5) selos = conquistarSelo(selos, "guardiao-do-bem-estar");
      return {
        ...ganho,
        habitos: { ...state.habitos, aguas },
        selos,
      };
    }),

  registrarAlongamento: () =>
    set((state) => {
      const alongamentos = state.habitos.alongamentos + 1;
      const ganho = aplicarGanho(state, PONTOS_POR_HABITO.alongamento);
      let selos = state.selos;
      if (alongamentos >= 3) selos = conquistarSelo(selos, "corpo-em-movimento");
      if (ganho.nivel >= 5) selos = conquistarSelo(selos, "guardiao-do-bem-estar");
      return {
        ...ganho,
        habitos: { ...state.habitos, alongamentos },
        selos,
      };
    }),

  registrarPausa: () =>
    set((state) => {
      const pausas = state.habitos.pausas + 1;
      const ganho = aplicarGanho(state, PONTOS_POR_HABITO.pausa);
      let selos = state.selos;
      if (pausas >= 2) selos = conquistarSelo(selos, "pausa-consciente");
      if (ganho.nivel >= 5) selos = conquistarSelo(selos, "guardiao-do-bem-estar");
      return {
        ...ganho,
        habitos: { ...state.habitos, pausas },
        selos,
      };
    }),

  resetarDia: () =>
    set(() => ({
      habitos: { aguas: 0, alongamentos: 0, pausas: 0 },
    })),
}));
