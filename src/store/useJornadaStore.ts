import { create } from "zustand";
import { buildNudge } from "@/lib/erina/mensagens";

/* ------------------------------------------------------------------ */
/* Tipos públicos                                                      */
/* ------------------------------------------------------------------ */

export type JornadaStatus = "em_andamento" | "em_pausa" | "encerrada";

export type NudgeType =
  | "hidratacao"
  | "alongar"
  | "pausa"
  | "limite_jornada"
  | "fim_pausa";

export interface Pausa {
  id: string;
  inicioSegundos: number;
  fimSegundos: number | null;
  duracaoSegundos: number;
}

export interface MensagemErina {
  id: string;
  autor: "erina" | "user";
  texto: string;
  timestamp: number;
}

export interface Nudge {
  id: string;
  tipo: NudgeType;
  titulo: string;
  mensagem: string;
  emoji: string;
  timestamp: number;
  acoes: { label: string; tipo: "confirmar" | "dispensar" }[];
  resumoPerdido?: {
    id: string;
    canal: "email" | "whatsapp";
    de: string;
    assunto: string;
  }[];
}

export interface StatusCLT {
  conforme: boolean;
  titulo: string;
  descricao: string;
  itens: { label: string; ok: boolean }[];
}

/* ------------------------------------------------------------------ */
/* Estado + ações                                                      */
/* ------------------------------------------------------------------ */

export interface JornadaState {
  /* --- estado --- */
  jornadaStatus: JornadaStatus;
  inicioLabel: string;
  segundosTrabalhados: number;
  metaSegundos: number;
  baselineSaldoSegundos: number;
  pausas: Pausa[];
  pausaAtualInicio: number | null;
  segundosPausaAtual: number;
  metaPausaSegundos: number;
  segundosDesdeUltimaAgua: number;
  segundosSentada: number;
  segundosDesdeUltimaPausa: number;
  mensagensErina: MensagemErina[];
  nudges: Nudge[];
  chatAberto: boolean;
  modoDemo: boolean;

  /* --- ações --- */
  tick: (deltaSegundos?: number) => void;
  iniciarJornada: () => void;
  configurarPorPapel: (papel: "funcionario" | "gestor") => void;
  iniciarPausa: () => void;
  encerrarPausa: () => void;
  encerrarJornada: () => void;
  registrarAgua: () => void;
  registrarAlongamento: () => void;
  abrirChat: () => void;
  fecharChat: () => void;
  toggleChat: () => void;
  enviarMensagemUsuario: (texto: string) => void;
  adicionarMensagemErina: (texto: string) => void;
  addNudge: (nudge: Nudge) => void;
  removerNudge: (id: string) => void;
  resolverNudge: (id: string, acaoTipo: "confirmar" | "dispensar") => void;
  toggleModoDemo: () => void;
}

/* ------------------------------------------------------------------ */
/* Helpers internos                                                    */
/* ------------------------------------------------------------------ */

function novoId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/* ------------------------------------------------------------------ */
/* Selectors / derivados (funções puras exportadas)                    */
/* Recebem o snapshot do estado.                                       */
/* ------------------------------------------------------------------ */

export type JornadaSnapshot = Pick<
  JornadaState,
  | "jornadaStatus"
  | "segundosTrabalhados"
  | "metaSegundos"
  | "baselineSaldoSegundos"
  | "pausas"
  | "segundosDesdeUltimaAgua"
  | "segundosSentada"
  | "segundosDesdeUltimaPausa"
>;

/** Saldo do dia em segundos (pode ser negativo). Inicial: 1458s ≈ +00:24. */
export function getSaldoSegundos(state: JornadaSnapshot): number {
  return state.segundosTrabalhados - state.baselineSaldoSegundos;
}

/** Progresso rumo à meta, normalizado 0..1. Inicial ≈ 0.80. */
export function getProgressoMeta(state: JornadaSnapshot): number {
  if (state.metaSegundos <= 0) return 0;
  return clamp(state.segundosTrabalhados / state.metaSegundos, 0, 1);
}

/** Soma das durações de todas as pausas registradas (segundos). */
export function getTotalPausasSegundos(state: JornadaSnapshot): number {
  return state.pausas.reduce((acc, p) => acc + p.duracaoSegundos, 0);
}

/** Deriva o status de conformidade CLT do dia. */
export function getStatusCLT(state: JornadaSnapshot): StatusCLT {
  const fezPausa = state.pausas.length >= 1;
  const dentroLimite = state.segundosTrabalhados <= state.metaSegundos + 1800;
  const semHoraExtra = state.segundosTrabalhados <= state.metaSegundos;
  const conforme = dentroLimite && fezPausa;

  const itens = [
    { label: "Intervalo realizado", ok: fezPausa },
    { label: "Jornada dentro do limite", ok: dentroLimite },
    { label: "Descanso diário ok", ok: fezPausa },
    { label: "Sem horas extras", ok: semHoraExtra },
  ];

  if (conforme && semHoraExtra) {
    return {
      conforme: true,
      titulo: "Dentro das regras",
      descricao:
        "Tudo certo! Sua jornada está em conformidade com a legislação trabalhista.",
      itens,
    };
  }

  if (conforme && !semHoraExtra) {
    return {
      conforme: true,
      titulo: "Atenção às horas extras",
      descricao:
        "Você passou da meta do dia e está fazendo horas extras. Ainda dentro do limite legal, mas vale cuidar do seu descanso.",
      itens,
    };
  }

  // Não conforme
  return {
    conforme: false,
    titulo: !fezPausa ? "Falta seu intervalo" : "Atenção às horas extras",
    descricao: !fezPausa
      ? "Você ainda não registrou uma pausa hoje. A CLT prevê intervalo de descanso — cuide de você."
      : "Você ultrapassou o limite recomendado de jornada. Considere encerrar e descansar.",
    itens,
  };
}

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

export const useJornadaStore = create<JornadaState>((set, get) => ({
  /* --- estado inicial --- */
  jornadaStatus: "em_andamento",
  inicioLabel: "08:00",
  segundosTrabalhados: 23058,
  metaSegundos: 28800,
  baselineSaldoSegundos: 21600,
  pausas: [
    { id: "p1", inicioSegundos: 7200, fimSegundos: 8100, duracaoSegundos: 900 },
    {
      id: "p2",
      inicioSegundos: 14400,
      fimSegundos: 15300,
      duracaoSegundos: 900,
    },
  ],
  pausaAtualInicio: null,
  segundosPausaAtual: 0,
  metaPausaSegundos: 900,
  segundosDesdeUltimaAgua: 0,
  segundosSentada: 0,
  segundosDesdeUltimaPausa: 0,
  mensagensErina: [],
  nudges: [],
  chatAberto: false,
  modoDemo: false,

  /* --- ações --- */
  tick: (deltaSegundos = 1) => {
    const { jornadaStatus } = get();
    if (jornadaStatus === "em_andamento") {
      set((s) => ({
        segundosTrabalhados: s.segundosTrabalhados + deltaSegundos,
        segundosDesdeUltimaAgua: s.segundosDesdeUltimaAgua + deltaSegundos,
        segundosSentada: s.segundosSentada + deltaSegundos,
        segundosDesdeUltimaPausa: s.segundosDesdeUltimaPausa + deltaSegundos,
      }));
    } else if (jornadaStatus === "em_pausa") {
      // Em pausa não conta trabalho nem tempo sentada.
      // A hidratação continua sendo cobrada mesmo durante o descanso,
      // e o cronômetro da pausa avança.
      set((s) => ({
        segundosDesdeUltimaAgua: s.segundosDesdeUltimaAgua + deltaSegundos,
        segundosPausaAtual: s.segundosPausaAtual + deltaSegundos,
      }));
    }
    // 'encerrada' -> nada.
  },

  iniciarJornada: () => {
    // Recomeça uma jornada nova e limpa (roda no client → hora atual real).
    const agora = new Date();
    const hh = String(agora.getHours()).padStart(2, "0");
    const mm = String(agora.getMinutes()).padStart(2, "0");
    set({
      jornadaStatus: "em_andamento",
      inicioLabel: `${hh}:${mm}`,
      segundosTrabalhados: 0,
      pausas: [],
      pausaAtualInicio: null,
      segundosPausaAtual: 0,
      segundosDesdeUltimaAgua: 0,
      segundosSentada: 0,
      segundosDesdeUltimaPausa: 0,
      baselineSaldoSegundos: 0,
    });
  },

  configurarPorPapel: (papel) => {
    // Baseline mock distinto por papel — gestor e funcionário são pessoas
    // diferentes, então veem jornada/saldo/pausas diferentes.
    if (papel === "gestor") {
      // Rafael (gestor): 05:18 trabalhadas, saldo +00:18, 1 pausa de 20min.
      set({
        jornadaStatus: "em_andamento",
        inicioLabel: "09:00",
        segundosTrabalhados: 19080,
        metaSegundos: 28800,
        baselineSaldoSegundos: 18000,
        pausas: [
          {
            id: "g1",
            inicioSegundos: 7200,
            fimSegundos: 8400,
            duracaoSegundos: 1200,
          },
        ],
        pausaAtualInicio: null,
        segundosPausaAtual: 0,
        segundosDesdeUltimaAgua: 0,
        segundosSentada: 0,
        segundosDesdeUltimaPausa: 0,
      });
      return;
    }

    // Mariana (funcionário): 06:24 trabalhadas, saldo +00:24, 2 pausas de 15min.
    set({
      jornadaStatus: "em_andamento",
      inicioLabel: "08:00",
      segundosTrabalhados: 23058,
      metaSegundos: 28800,
      baselineSaldoSegundos: 21600,
      pausas: [
        {
          id: "p1",
          inicioSegundos: 7200,
          fimSegundos: 8100,
          duracaoSegundos: 900,
        },
        {
          id: "p2",
          inicioSegundos: 14400,
          fimSegundos: 15300,
          duracaoSegundos: 900,
        },
      ],
      pausaAtualInicio: null,
      segundosPausaAtual: 0,
      segundosDesdeUltimaAgua: 0,
      segundosSentada: 0,
      segundosDesdeUltimaPausa: 0,
    });
  },

  iniciarPausa: () => {
    const { jornadaStatus, segundosTrabalhados } = get();
    if (jornadaStatus !== "em_andamento") return;
    set({
      jornadaStatus: "em_pausa",
      pausaAtualInicio: segundosTrabalhados,
      segundosPausaAtual: 0,
      segundosDesdeUltimaPausa: 0,
      segundosSentada: 0,
    });
  },

  encerrarPausa: () => {
    const { jornadaStatus, pausaAtualInicio, segundosTrabalhados, segundosPausaAtual } =
      get();
    if (jornadaStatus !== "em_pausa") return;
    const inicio = pausaAtualInicio ?? segundosTrabalhados;
    // A duração vem do cronômetro da pausa (segundosPausaAtual), que avança no
    // tick durante o descanso — segundosTrabalhados fica parado na pausa.
    const diff = Math.max(1, segundosPausaAtual);
    const novaPausa: Pausa = {
      id: novoId(),
      inicioSegundos: inicio,
      fimSegundos: inicio + diff,
      duracaoSegundos: diff,
    };
    set((s) => ({
      pausas: [...s.pausas, novaPausa],
      pausaAtualInicio: null,
      segundosPausaAtual: 0,
      jornadaStatus: "em_andamento",
    }));
    // Nudge de boas-vindas de volta (resumo do que foi perdido).
    get().addNudge(buildNudge("fim_pausa", {}));
  },

  encerrarJornada: () => set({ jornadaStatus: "encerrada" }),

  registrarAgua: () => set({ segundosDesdeUltimaAgua: 0 }),

  registrarAlongamento: () => set({ segundosSentada: 0 }),

  abrirChat: () => set({ chatAberto: true }),
  fecharChat: () => set({ chatAberto: false }),
  toggleChat: () => set((s) => ({ chatAberto: !s.chatAberto })),

  enviarMensagemUsuario: (texto) =>
    set((s) => ({
      mensagensErina: [
        ...s.mensagensErina,
        {
          id: novoId(),
          autor: "user",
          texto,
          timestamp: Date.now(),
        },
      ],
    })),

  adicionarMensagemErina: (texto) =>
    set((s) => ({
      mensagensErina: [
        ...s.mensagensErina,
        {
          id: novoId(),
          autor: "erina",
          texto,
          timestamp: Date.now(),
        },
      ],
    })),

  addNudge: (nudge) => set((s) => ({ nudges: [...s.nudges, nudge] })),

  removerNudge: (id) =>
    set((s) => ({ nudges: s.nudges.filter((n) => n.id !== id) })),

  resolverNudge: (id, acaoTipo) => {
    const nudge = get().nudges.find((n) => n.id === id);
    if (!nudge) return;
    if (acaoTipo === "confirmar") {
      switch (nudge.tipo) {
        case "hidratacao":
          get().registrarAgua();
          break;
        case "alongar":
          get().registrarAlongamento();
          break;
        case "pausa":
          get().iniciarPausa();
          break;
        case "limite_jornada":
        case "fim_pausa":
        default:
          break;
      }
    }
    get().removerNudge(id);
  },

  toggleModoDemo: () => set((s) => ({ modoDemo: !s.modoDemo })),
}));
