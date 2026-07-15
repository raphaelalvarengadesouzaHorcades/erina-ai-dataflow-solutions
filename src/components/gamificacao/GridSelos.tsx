"use client";

import { Lock, Sparkles, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGamificacaoStore, type Selo } from "@/store/useGamificacaoStore";

/* ------------------------------------------------------------------ */
/* Card de um selo individual                                          */
/* ------------------------------------------------------------------ */

function SeloCard({ selo }: { selo: Selo }) {
  return (
    <div
      title={selo.descricao}
      className={cn(
        "group relative flex flex-col items-center rounded-xl border p-4 text-center transition-colors",
        selo.conquistado
          ? "border-primary/20 bg-primary-light"
          : "border-border-soft bg-page",
      )}
    >
      {/* cadeado nos bloqueados */}
      {!selo.conquistado && (
        <span className="absolute right-2 top-2 text-muted">
          <Lock className="h-3.5 w-3.5" strokeWidth={2.4} />
        </span>
      )}

      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full text-2xl",
          selo.conquistado ? "bg-card shadow-sm" : "bg-border-soft grayscale",
        )}
        aria-hidden
      >
        {selo.emoji}
      </span>

      <span
        className={cn(
          "mt-2 text-sm font-semibold",
          selo.conquistado ? "text-ink" : "text-muted",
        )}
      >
        {selo.nome}
      </span>

      <span className="mt-1 text-[11px] leading-snug text-muted">
        {selo.descricao}
      </span>

      {selo.conquistado && (
        <span className="mt-2 rounded-full bg-success-light px-2 py-0.5 text-[10px] font-bold text-success-dark">
          Conquistado
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Selos JÁ conquistados — em destaque no topo                         */
/* ------------------------------------------------------------------ */

/**
 * Card "Suas conquistas": mostra apenas os selos desbloqueados, coloridos e
 * em destaque. Feito para preencher o espaço ao lado da plantinha.
 */
export function SelosConquistados() {
  const selos = useGamificacaoStore((s) => s.selos);
  const conquistados = selos.filter((s) => s.conquistado);
  const total = selos.length;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-primary/20 bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-light text-primary">
            <Sparkles className="h-4 w-4" strokeWidth={2.4} />
          </span>
          Suas conquistas
        </h2>
        <span className="text-xs font-medium text-muted tabular-nums">
          {conquistados.length} de {total} selos
        </span>
      </div>

      {conquistados.length > 0 ? (
        <div className="grid flex-1 grid-cols-2 content-start gap-3 sm:grid-cols-3">
          {conquistados.map((selo) => (
            <SeloCard key={selo.id} selo={selo} />
          ))}
        </div>
      ) : (
        <p className="flex flex-1 items-center justify-center text-center text-sm text-muted">
          Seus primeiros selos aparecem aqui assim que você começar a se cuidar.
          Sem pressa. 💜
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Selos AINDA não conquistados — "Próximas conquistas"               */
/* ------------------------------------------------------------------ */

/**
 * Card "Próximas conquistas": selos bloqueados (cinza com cadeado), mostrados
 * mais abaixo como metas gentis — sem cobrança.
 */
export function SelosBloqueados() {
  const selos = useGamificacaoStore((s) => s.selos);
  const bloqueados = selos.filter((s) => !s.conquistado);

  if (bloqueados.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
      <div className="mb-1 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-border-soft text-muted">
          <Target className="h-4 w-4" strokeWidth={2.4} />
        </span>
        <h2 className="text-lg font-bold text-ink">Próximas conquistas</h2>
      </div>
      <p className="mb-4 text-sm text-muted">
        Novos selos para desbloquear no seu tempo — são convites ao cuidado, não
        metas de cobrança.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {bloqueados.map((selo) => (
          <SeloCard key={selo.id} selo={selo} />
        ))}
      </div>
    </div>
  );
}
