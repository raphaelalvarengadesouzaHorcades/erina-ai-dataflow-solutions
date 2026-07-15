"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useJornadaStore, type Nudge } from "@/store/useJornadaStore";
import { ErinaAvatar } from "@/components/erina/ErinaAvatar";

/** Tempo até o toast sumir sozinho (ms) se ninguém interagir. */
const AUTO_DISMISS_MS = 12_000;
/** O resumo de fim de pausa merece um tempinho a mais pra ler com calma. */
const AUTO_DISMISS_FIM_PAUSA_MS = 20_000;
/** Duração da animação de saída antes de remover do store (ms). */
const SAIDA_MS = 280;

export function NudgeToast({ nudge }: { nudge: Nudge }) {
  const removerNudge = useJornadaStore((s) => s.removerNudge);
  const resolverNudge = useJornadaStore((s) => s.resolverNudge);

  const [visivel, setVisivel] = useState(false);
  const [saindo, setSaindo] = useState(false);

  const duracao =
    nudge.tipo === "fim_pausa" ? AUTO_DISMISS_FIM_PAUSA_MS : AUTO_DISMISS_MS;

  const barraRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restanteRef = useRef(duracao);
  const inicioRef = useRef(0);
  const saindoRef = useRef(false);

  // Animação de entrada (slide + fade + leve escala).
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisivel(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const limparTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Fecha com animação de saída e remove do store ao final.
  const fecharCom = useCallback(
    (depois: () => void) => {
      if (saindoRef.current) return;
      saindoRef.current = true;
      limparTimer();
      setSaindo(true);
      setTimeout(depois, SAIDA_MS);
    },
    [limparTimer]
  );

  // (Re)arma a contagem de auto-dismiss e a barrinha visual.
  const armar = useCallback(() => {
    if (saindoRef.current) return;
    limparTimer();
    inicioRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      fecharCom(() => removerNudge(nudge.id));
    }, restanteRef.current);

    const el = barraRef.current;
    if (el) {
      const proporcao = restanteRef.current / duracao;
      el.style.transition = "none";
      el.style.transform = `scaleX(${proporcao})`;
      // força reflow pra transição pegar do ponto certo
      void el.offsetWidth;
      el.style.transition = `transform ${restanteRef.current}ms linear`;
      el.style.transform = "scaleX(0)";
    }
  }, [duracao, fecharCom, limparTimer, nudge.id, removerNudge]);

  // Pausa a contagem (e congela a barrinha) — não some enquanto a pessoa lê.
  const pausar = useCallback(() => {
    if (saindoRef.current || timerRef.current === null) return;
    limparTimer();
    restanteRef.current = Math.max(
      0,
      restanteRef.current - (Date.now() - inicioRef.current)
    );
    const el = barraRef.current;
    if (el) {
      const atual = getComputedStyle(el).transform;
      el.style.transition = "none";
      el.style.transform = atual === "none" ? "scaleX(0)" : atual;
    }
  }, [limparTimer]);

  useEffect(() => {
    armar();
    return limparTimer;
  }, [armar, limparTimer]);

  const encerrar = (depois: () => void) => fecharCom(depois);

  return (
    <div
      onMouseEnter={pausar}
      onMouseLeave={armar}
      role="status"
      className={cn(
        "w-[340px] overflow-hidden rounded-2xl border border-border-soft bg-card shadow-xl",
        "transition-all duration-300 ease-out will-change-transform",
        visivel && !saindo
          ? "translate-x-0 scale-100 opacity-100"
          : "translate-x-6 scale-[0.97] opacity-0"
      )}
    >
      <div className="p-4">
        {/* Cabeçalho: avatar da Erina + badge de emoji + título + mensagem */}
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <ErinaAvatar size={40} />
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-border-soft bg-card text-[11px] leading-none shadow-sm">
              {nudge.emoji}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold leading-snug text-ink">
              {nudge.titulo}
            </p>
            <p className="mt-1 text-sm leading-snug text-muted">
              {nudge.mensagem}
            </p>
          </div>

          <button
            type="button"
            onClick={() => encerrar(() => removerNudge(nudge.id))}
            aria-label="Dispensar"
            className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-page hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Resumo do que foi perdido (fim de pausa) */}
        {nudge.resumoPerdido && nudge.resumoPerdido.length > 0 && (
          <div className="mt-3 space-y-1 rounded-xl bg-page p-1.5">
            {nudge.resumoPerdido.map((item, i) => {
              const Icone = item.canal === "email" ? Mail : MessageCircle;
              return (
                <Link
                  key={i}
                  href={`/mensagens?aba=${item.canal}&id=${item.id}`}
                  onClick={() =>
                    fecharCom(() => removerNudge(nudge.id))
                  }
                  className="flex items-start gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-primary-light"
                >
                  <Icone className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                  <p className="min-w-0 text-xs leading-snug">
                    <span className="font-semibold text-ink">{item.de}</span>{" "}
                    <span className="text-muted">{item.assunto}</span>
                  </p>
                </Link>
              );
            })}
          </div>
        )}

        {/* Ações */}
        {nudge.acoes.length > 0 && (
          <div className="mt-3 flex gap-2">
            {nudge.acoes.map((acao, i) => (
              <button
                key={i}
                type="button"
                onClick={() => encerrar(() => resolverNudge(nudge.id, acao.tipo))}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  acao.tipo === "confirmar"
                    ? "flex-1 bg-primary text-white shadow-sm hover:bg-primary-hover"
                    : "bg-page text-muted hover:bg-border-soft hover:text-ink"
                )}
              >
                {acao.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Barrinha de tempo: sinaliza sutilmente que o toast some sozinho. */}
      <div className="h-1 w-full bg-page">
        <div
          ref={barraRef}
          className="h-full origin-left bg-primary/50"
          style={{ transform: "scaleX(1)" }}
        />
      </div>
    </div>
  );
}
