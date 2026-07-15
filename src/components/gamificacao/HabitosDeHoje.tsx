"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Droplets, Coffee, Plus } from "lucide-react";
import { HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/dashboard/ProgressBar";
import {
  METAS_HABITOS,
  PONTOS_POR_HABITO,
  useGamificacaoStore,
} from "@/store/useGamificacaoStore";

interface HabitoCardProps {
  icon: LucideIcon;
  emoji: string;
  titulo: string;
  atual: number;
  meta: number;
  pontos: number;
  corTrilho: string;
  corIcone: string;
  onRegistrar: () => void;
}

function HabitoCard({
  icon: Icon,
  emoji,
  titulo,
  atual,
  meta,
  pontos,
  corTrilho,
  corIcone,
  onRegistrar,
}: HabitoCardProps) {
  const [pulou, setPulou] = useState(false);
  const progresso = meta > 0 ? atual / meta : 0;
  const completo = atual >= meta;

  function handleClick() {
    onRegistrar();
    setPulou(true);
    window.setTimeout(() => setPulou(false), 350);
  }

  return (
    <div className="flex flex-col rounded-xl border border-border-soft bg-page p-4">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            corIcone,
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <span className="text-sm font-semibold text-ink">
          {emoji} {titulo}
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-1">
        <span
          className={cn(
            "text-2xl font-bold tabular-nums text-ink transition-transform",
            pulou && "scale-125 text-success-dark",
          )}
        >
          {atual}
        </span>
        <span className="text-sm text-muted">/ {meta}</span>
      </div>

      <ProgressBar
        progresso={progresso}
        className="mt-2"
        fillClassName={corTrilho}
      />

      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
          completo
            ? "bg-success-light text-success-dark hover:bg-success-light/80"
            : "bg-primary text-white hover:bg-primary-hover",
        )}
      >
        <Plus className="h-4 w-4" strokeWidth={2.6} />
        Registrar
        <span className="ml-0.5 rounded-full bg-white/25 px-1.5 py-0.5 text-[11px] font-bold">
          +{pontos}
        </span>
      </button>
    </div>
  );
}

/**
 * Bloco "Hábitos de hoje": três cards com contadores ao vivo e botões que
 * chamam as ações do store somando pontos em tempo real.
 */
export function HabitosDeHoje() {
  const habitos = useGamificacaoStore((s) => s.habitos);
  const registrarAgua = useGamificacaoStore((s) => s.registrarAgua);
  const registrarAlongamento = useGamificacaoStore((s) => s.registrarAlongamento);
  const registrarPausa = useGamificacaoStore((s) => s.registrarPausa);

  return (
    <div className="rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">Hábitos de hoje</h2>
        <span className="text-xs text-muted">
          Cada registro soma pontos na hora
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <HabitoCard
          icon={Droplets}
          emoji="💧"
          titulo="Água"
          atual={habitos.aguas}
          meta={METAS_HABITOS.aguas}
          pontos={PONTOS_POR_HABITO.agua}
          corIcone="bg-primary-light text-primary"
          corTrilho="bg-primary"
          onRegistrar={registrarAgua}
        />
        <HabitoCard
          icon={HeartPulse}
          emoji="🧘"
          titulo="Alongamentos"
          atual={habitos.alongamentos}
          meta={METAS_HABITOS.alongamentos}
          pontos={PONTOS_POR_HABITO.alongamento}
          corIcone="bg-success-light text-success-dark"
          corTrilho="bg-success"
          onRegistrar={registrarAlongamento}
        />
        <HabitoCard
          icon={Coffee}
          emoji="☕"
          titulo="Pausas"
          atual={habitos.pausas}
          meta={METAS_HABITOS.pausas}
          pontos={PONTOS_POR_HABITO.pausa}
          corIcone="bg-warning/15 text-warning"
          corTrilho="bg-warning"
          onRegistrar={registrarPausa}
        />
      </div>
    </div>
  );
}
