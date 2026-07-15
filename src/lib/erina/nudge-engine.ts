import type { JornadaState, NudgeType } from "@/store/useJornadaStore";
import type { LimitesNudge, NudgeCtx } from "@/lib/erina/mensagens";

/**
 * Subconjunto do estado necessário para avaliar nudges.
 * (Aceita o JornadaState completo do store.)
 */
export type EngineSnapshot = Pick<
  JornadaState,
  | "jornadaStatus"
  | "segundosTrabalhados"
  | "metaSegundos"
  | "segundosDesdeUltimaAgua"
  | "segundosSentada"
  | "segundosDesdeUltimaPausa"
>;

/**
 * Avalia — de forma PURA — quais nudges deveriam disparar AGORA,
 * dado o estado e um conjunto de limites (LIMITES_NORMAIS ou LIMITES_DEMO).
 *
 * Só dispara quando a jornada está 'em_andamento'. Retorna a lista de tipos.
 * Não dispara o mesmo tipo repetidamente por conta própria: como esta função
 * é pura, quem consome deve zerar o contador correspondente ao criar o nudge
 * (ou o contador zera quando o usuário resolve a ação, ex.: registrarAgua()).
 */
export function avaliarNudges(
  state: EngineSnapshot,
  limites: LimitesNudge
): NudgeType[] {
  if (state.jornadaStatus !== "em_andamento") return [];

  const tipos: NudgeType[] = [];

  if (state.segundosDesdeUltimaAgua >= limites.aguaSeg) {
    tipos.push("hidratacao");
  }
  if (state.segundosSentada >= limites.sentadaSeg) {
    tipos.push("alongar");
  }
  if (state.segundosDesdeUltimaPausa >= limites.semPausaSeg) {
    tipos.push("pausa");
  }

  const restante = state.metaSegundos - state.segundosTrabalhados;
  if (restante > 0 && restante <= limites.limiteJornadaAntecedenciaSeg) {
    tipos.push("limite_jornada");
  }

  return tipos;
}

/**
 * Monta o contexto (em minutos) que o buildNudge usa para redigir as mensagens.
 */
export function construirContexto(state: EngineSnapshot): NudgeCtx {
  const restante = Math.max(0, state.metaSegundos - state.segundosTrabalhados);
  return {
    minutosDesdeAgua: Math.floor(state.segundosDesdeUltimaAgua / 60),
    minutosSentada: Math.floor(state.segundosSentada / 60),
    minutosSemPausa: Math.floor(state.segundosDesdeUltimaPausa / 60),
    minutosParaLimite: Math.ceil(restante / 60),
  };
}

/*
 * ------------------------------------------------------------------
 * COMO O PROVIDER REACT DEVE USAR ESTA LÓGICA (não implementado aqui):
 * ------------------------------------------------------------------
 * Crie um client component (ex.: <ErinaProvider>) com um setInterval:
 *
 *   const LIMITES = state.modoDemo ? LIMITES_DEMO : LIMITES_NORMAIS;
 *   const intervalMs = state.modoDemo ? 1000 : 1000;
 *
 *   setInterval(() => {
 *     store.tick(1);                              // avança 1s (ou N)
 *     const s = store.getState();
 *     const tipos = avaliarNudges(s, LIMITES);
 *     const ctx = construirContexto(s);
 *     for (const tipo of tipos) {
 *       // evita spam: só cria se ainda não há nudge ativo desse tipo
 *       const jaAtivo = s.nudges.some((n) => n.tipo === tipo);
 *       if (jaAtivo) continue;
 *       store.addNudge(buildNudge(tipo, ctx));
 *       // zera o contador correspondente para não redisparar em looping
 *       switch (tipo) {
 *         case "hidratacao": store.registrarAgua(); break;
 *         case "alongar":    store.registrarAlongamento(); break;
 *         case "pausa":      store.setState({ segundosDesdeUltimaPausa: 0 }); break;
 *         // limite_jornada: sem contador para zerar; o "jaAtivo" já evita repetir.
 *       }
 *     }
 *   }, intervalMs);
 *
 * Limpe o interval no cleanup do useEffect.
 * ------------------------------------------------------------------
 */
