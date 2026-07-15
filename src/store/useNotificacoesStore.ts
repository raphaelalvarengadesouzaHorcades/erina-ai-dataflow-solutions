import { create } from "zustand";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

export type TipoNotificacao = "info" | "sucesso" | "alerta" | "erro";

export interface Notificacao {
  id: string;
  titulo: string;
  descricao: string;
  tipo: TipoNotificacao;
  /** Texto relativo já formatado (ex.: "agora", "há 5 min"). */
  tempo: string;
  lida: boolean;
}

/* ------------------------------------------------------------------ */
/* Seed inicial (mock)                                                 */
/* ------------------------------------------------------------------ */

const SEED: Notificacao[] = [
  {
    id: "seed-1",
    titulo: "Pausa recomendada 💧",
    descricao: "Você está focada há 50 min. Que tal um copo de água e alongar?",
    tipo: "info",
    tempo: "agora",
    lida: false,
  },
  {
    id: "seed-2",
    titulo: "Jornada perto do limite ⏰",
    descricao: "Faltam 30 min para completar 8h de jornada hoje.",
    tipo: "alerta",
    tempo: "há 12 min",
    lida: false,
  },
  {
    id: "seed-3",
    titulo: "Banco de horas atualizado",
    descricao: "Seu saldo subiu para +04:20. Bom trabalho!",
    tipo: "sucesso",
    tempo: "há 1 h",
    lida: true,
  },
  {
    id: "seed-4",
    titulo: "Nova mensagem de Ana (RH)",
    descricao: "“Passa aqui quando puder para falarmos das férias.”",
    tipo: "info",
    tempo: "há 3 h",
    lida: true,
  },
];

/* ------------------------------------------------------------------ */
/* Gerador de id (sem depender de Date.now no corpo do store)          */
/* ------------------------------------------------------------------ */

let contadorId = 0;
function novoId(): string {
  contadorId += 1;
  return `notif-${contadorId}`;
}

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

export interface NotificacoesState {
  /* --- estado --- */
  notificacoes: Notificacao[];
  /** Notificações atualmente exibidas como toaster (canto superior direito). */
  toasts: Notificacao[];
  /** Painel dropdown do sino aberto (true) x fechado (false). */
  painelAberto: boolean;

  /* --- ações do painel --- */
  abrirPainel: () => void;
  fecharPainel: () => void;
  togglePainel: () => void;

  /* --- ações de leitura --- */
  marcarLida: (id: string) => void;
  marcarTodasLidas: () => void;

  /* --- ações de toaster --- */
  /** Insere uma notificação no topo da lista E empurra em `toasts`. */
  adicionar: (n: Omit<Notificacao, "id" | "lida"> & { lida?: boolean }) => void;
  removerToast: (id: string) => void;
}

export const useNotificacoesStore = create<NotificacoesState>((set) => ({
  notificacoes: SEED,
  toasts: [],
  painelAberto: false,

  abrirPainel: () => set({ painelAberto: true }),
  fecharPainel: () => set({ painelAberto: false }),
  togglePainel: () => set((s) => ({ painelAberto: !s.painelAberto })),

  marcarLida: (id) =>
    set((s) => ({
      notificacoes: s.notificacoes.map((n) =>
        n.id === id ? { ...n, lida: true } : n
      ),
    })),

  marcarTodasLidas: () =>
    set((s) => ({
      notificacoes: s.notificacoes.map((n) => ({ ...n, lida: true })),
    })),

  adicionar: (n) => {
    const nova: Notificacao = {
      id: novoId(),
      lida: false,
      ...n,
    };
    set((s) => ({
      notificacoes: [nova, ...s.notificacoes],
      toasts: [nova, ...s.toasts],
    }));
  },

  removerToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/* ------------------------------------------------------------------ */
/* Seletores / derivados                                               */
/* ------------------------------------------------------------------ */

/** Contagem de notificações não-lidas. Use com o store: `useNotificacoesStore(contarNaoLidas)`. */
export function contarNaoLidas(s: NotificacoesState): number {
  return s.notificacoes.reduce((total, n) => total + (n.lida ? 0 : 1), 0);
}
