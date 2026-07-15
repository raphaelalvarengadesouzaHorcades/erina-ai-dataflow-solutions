import type { Nudge, NudgeType } from "@/store/useJornadaStore";
import { EMAILS, CONVERSAS } from "@/components/mensagens/data";

/* ------------------------------------------------------------------ */
/* Resumo "o que você perdeu na pausa" — vem da MESMA caixa de entrada  */
/* (/mensagens), para os pop-ups do demo refletirem os e-mails e        */
/* WhatsApp reais (mesmos remetentes e assuntos).                       */
/* ------------------------------------------------------------------ */

const RESUMO_PAUSA: NonNullable<Nudge["resumoPerdido"]> = [
  ...EMAILS.filter((e) => e.naoLido)
    .slice(0, 2)
    .map((e) => ({
      id: e.id,
      canal: "email" as const,
      de: e.remetente,
      assunto: e.assunto,
    })),
  ...CONVERSAS.filter((c) => c.naoLidas > 0)
    .slice(0, 2)
    .map((c) => ({
      id: c.id,
      canal: "whatsapp" as const,
      de: c.nome,
      assunto: c.ultimaMsg,
    })),
];

const RESUMO_N_EMAILS = RESUMO_PAUSA.filter((r) => r.canal === "email").length;
const RESUMO_N_ZAPS = RESUMO_PAUSA.filter((r) => r.canal === "whatsapp").length;

/* ------------------------------------------------------------------ */
/* Limites / thresholds (em segundos)                                  */
/* O engine escolhe qual conjunto usar (normal x demo).                */
/* ------------------------------------------------------------------ */

export interface LimitesNudge {
  aguaSeg: number;
  sentadaSeg: number;
  semPausaSeg: number;
  /** Antecedência do aviso de limite de jornada (segundos antes da meta). */
  limiteJornadaAntecedenciaSeg: number;
}

export const LIMITES_NORMAIS: LimitesNudge = {
  aguaSeg: 45 * 60, // 45 min
  sentadaSeg: 50 * 60, // 50 min
  semPausaSeg: 90 * 60, // 90 min
  limiteJornadaAntecedenciaSeg: 30 * 60, // avisa 30 min antes da meta
};

export const LIMITES_DEMO: LimitesNudge = {
  aguaSeg: 20, // 20 s
  sentadaSeg: 25, // 25 s
  semPausaSeg: 30, // 30 s
  limiteJornadaAntecedenciaSeg: 30 * 60,
};

/* ------------------------------------------------------------------ */
/* Contexto para montar as mensagens                                   */
/* ------------------------------------------------------------------ */

export interface NudgeCtx {
  minutosDesdeAgua?: number;
  minutosSentada?: number;
  minutosSemPausa?: number;
  minutosParaLimite?: number;
}

function novoId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/* ------------------------------------------------------------------ */
/* buildNudge — função pura                                            */
/* ------------------------------------------------------------------ */

/**
 * Monta um objeto Nudge completo, na voz acolhedora da Erina (pt-BR).
 */
export function buildNudge(tipo: NudgeType, ctx: NudgeCtx = {}): Nudge {
  const base = {
    id: novoId(),
    tipo,
    timestamp: Date.now(),
  };

  switch (tipo) {
    case "hidratacao": {
      const min = ctx.minutosDesdeAgua ?? 45;
      return {
        ...base,
        emoji: "💧",
        titulo: "Que tal um gole d'água?",
        mensagem: `Já faz ${min} min desde a última. Se hidratar agora é um carinho com você. 💛`,
        acoes: [
          { label: "Bebi água", tipo: "confirmar" },
          { label: "Daqui a pouco", tipo: "dispensar" },
        ],
      };
    }

    case "alongar": {
      const min = ctx.minutosSentada ?? 50;
      return {
        ...base,
        emoji: "🧘",
        titulo: "Bora esticar o corpo?",
        mensagem: `Você está sentada há ${min} min. Que tal levantar e alongar uns 30 segundinhos?`,
        acoes: [
          { label: "Me aloguei", tipo: "confirmar" },
          { label: "Daqui a pouco", tipo: "dispensar" },
        ],
      };
    }

    case "pausa": {
      return {
        ...base,
        emoji: "☕",
        titulo: "Você merece uma pausa",
        mensagem: "Já fez bastante coisa hoje. Cinco minutinhos pra respirar caem bem, não acha?",
        acoes: [
          { label: "Fazer pausa", tipo: "confirmar" },
          { label: "Agora não", tipo: "dispensar" },
        ],
      };
    }

    case "limite_jornada": {
      const min = ctx.minutosParaLimite ?? 30;
      return {
        ...base,
        emoji: "⏰",
        titulo: "Chegando perto do limite",
        mensagem: `Faltam uns ${min} min pro seu limite do dia. Quer que eu te avise pra encerrar com calma?`,
        acoes: [
          { label: "Pode avisar", tipo: "confirmar" },
          { label: "Agora não", tipo: "dispensar" },
        ],
      };
    }

    case "fim_pausa":
    default: {
      return {
        ...base,
        tipo: "fim_pausa",
        emoji: "📬",
        titulo: "Que bom te ver de volta!",
        mensagem: `Enquanto você descansava, chegaram ${RESUMO_N_EMAILS} e-mails e ${RESUMO_N_ZAPS} mensagens no WhatsApp. Nada urgente, dá pra respirar. 🌿`,
        acoes: [{ label: "Obrigada, Erina", tipo: "dispensar" }],
        resumoPerdido: RESUMO_PAUSA,
      };
    }
  }
}
