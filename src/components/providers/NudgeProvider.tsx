"use client";

import { useEffect, useRef } from "react";
import { useJornadaStore, type NudgeType } from "@/store/useJornadaStore";
import { LIMITES_NORMAIS, buildNudge } from "@/lib/erina/mensagens";
import { avaliarNudges, construirContexto } from "@/lib/erina/nudge-engine";

/**
 * Quantos toasts podem coexistir na tela. O objetivo é NUNCA virar spam:
 * na prática mostramos 1 por vez; 2 só em transições (ex.: fim de pausa).
 */
const MAX_ATIVOS = 2;

/** Rodízio de lembretes no modo demonstração (um de cada vez, na ordem). */
const RODIZIO_DEMO: NudgeType[] = ["hidratacao", "alongar", "pausa"];

/** Primeiro lembrete da demo aparece cedo (segundos) pra banca ver logo. */
const DEMO_PRIMEIRO_SEG = 6;
/** Espaçamento entre lembretes da demo (segundos): calmo e agradável. */
const DEMO_INTERVALO_MIN = 35;
const DEMO_INTERVALO_MAX = 45;
/** Se já houver um toast na tela, tenta de novo só daqui a X s (não empilha). */
const DEMO_REAGENDA_SEG = 8;

function intervaloDemo(): number {
  const span = DEMO_INTERVALO_MAX - DEMO_INTERVALO_MIN;
  return DEMO_INTERVALO_MIN + Math.floor(Math.random() * (span + 1));
}

/**
 * Provider sem UI: roda o loop de tempo (tick) e agenda nudges.
 *
 * - Modo DEMO: agenda UM lembrete por ciclo (~35–45s), em rodízio
 *   (água → alongar → pausa → …). Nunca dispara dois ao mesmo tempo e
 *   espera a tela esvaziar antes do próximo — calmo e charmoso.
 * - Modo NORMAL: usa os limiares realistas (água ~45min etc.), mas
 *   dispara no máximo um por vez e respeita o teto de ativos.
 */
export function NudgeProvider() {
  const modoDemo = useJornadaStore((s) => s.modoDemo);

  // Estado do agendador da demo (persiste entre ticks).
  const acumuladoRef = useRef(0);
  const alvoRef = useRef(DEMO_PRIMEIRO_SEG);
  const indiceRef = useRef(0);

  useEffect(() => {
    // Reinicia o agendador ao trocar de modo.
    acumuladoRef.current = 0;
    alvoRef.current = DEMO_PRIMEIRO_SEG;
    indiceRef.current = 0;

    const intervalo = setInterval(() => {
      const store = useJornadaStore.getState();
      store.tick(1);

      const st = useJornadaStore.getState();

      /* ---------------------- MODO DEMONSTRAÇÃO ---------------------- */
      if (modoDemo) {
        if (st.jornadaStatus !== "em_andamento") return;

        acumuladoRef.current += 1;
        if (acumuladoRef.current < alvoRef.current) return;

        // Não empilha: se ainda há lembrete na tela, espera o próximo ciclo.
        if (st.nudges.length > 0) {
          alvoRef.current = acumuladoRef.current + DEMO_REAGENDA_SEG;
          return;
        }

        const tipo = RODIZIO_DEMO[indiceRef.current % RODIZIO_DEMO.length];
        indiceRef.current += 1;
        // ctx vazio → mensagens usam os defaults simpáticos do buildNudge.
        st.addNudge(buildNudge(tipo, {}));

        acumuladoRef.current = 0;
        alvoRef.current = intervaloDemo();
        return;
      }

      /* ------------------------- MODO NORMAL ------------------------- */
      // Respeita o teto de toasts visíveis.
      if (st.nudges.length >= MAX_ATIVOS) return;

      const tipos = avaliarNudges(st, LIMITES_NORMAIS);
      if (tipos.length === 0) return;

      const tiposAtivos = new Set(st.nudges.map((n) => n.tipo));
      // Dispara só UM por tick — nunca em rajada.
      const proximo = tipos.find((t) => !tiposAtivos.has(t));
      if (!proximo) return;

      const ctx = construirContexto(st);
      st.addNudge(buildNudge(proximo, ctx));

      // Zera o contador do tipo disparado para não repetir em looping.
      switch (proximo) {
        case "hidratacao":
          st.registrarAgua();
          break;
        case "alongar":
          st.registrarAlongamento();
          break;
        case "pausa":
          useJornadaStore.setState({ segundosDesdeUltimaPausa: 0 });
          break;
        default:
          break;
      }
    }, 1000);

    return () => clearInterval(intervalo);
  }, [modoDemo]);

  return null;
}
