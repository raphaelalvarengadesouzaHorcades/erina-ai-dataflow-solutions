"use client";

import { Flame, Sparkles, TrendingUp } from "lucide-react";
import {
  useGamificacaoStore,
  XP_POR_NIVEL,
} from "@/store/useGamificacaoStore";
import { ProgressBar } from "@/components/dashboard/ProgressBar";

/**
 * Cartão de destaque: pontos de bem-estar, sequência (streak) e barra de
 * progresso rumo ao próximo nível. Fundo em gradiente da marca.
 */
export function CartaoDestaque() {
  const pontos = useGamificacaoStore((s) => s.pontos);
  const streakDias = useGamificacaoStore((s) => s.streakDias);
  const nivel = useGamificacaoStore((s) => s.nivel);
  const xp = useGamificacaoStore((s) => s.xp);

  const progresso = Math.min(1, Math.max(0, xp / XP_POR_NIVEL));
  const xpRestante = Math.max(0, XP_POR_NIVEL - xp);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-white shadow-sm">
      {/* brilho decorativo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 right-16 h-32 w-32 rounded-full bg-white/5"
      />

      <div className="relative flex flex-col gap-6">
        {/* Pontos + streak */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-white/80">
              <Sparkles className="h-4 w-4" strokeWidth={2.2} />
              Pontos de bem-estar
            </div>
            <div className="mt-1 text-4xl font-bold tabular-nums">
              {pontos.toLocaleString("pt-BR")}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
            <Flame className="h-5 w-5 text-orange-200" strokeWidth={2.2} />
            <span className="text-sm font-semibold">
              {streakDias} dias cuidando de você
            </span>
          </div>
        </div>

        {/* Progresso de nível */}
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 font-semibold">
              <TrendingUp className="h-4 w-4" strokeWidth={2.2} />
              Nível {nivel}
            </span>
            <span className="text-white/80 tabular-nums">
              {xp} / {XP_POR_NIVEL} XP
            </span>
          </div>
          <ProgressBar
            progresso={progresso}
            className="h-2.5 bg-white/25"
            fillClassName="bg-white"
          />
          <p className="mt-2 text-xs text-white/80">
            Faltam <span className="font-semibold">{xpRestante} pontos</span> para
            o nível {nivel + 1}. Sem pressa — no seu ritmo.
          </p>
        </div>
      </div>
    </div>
  );
}
