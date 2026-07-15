import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export type Tendencia = "sobe-bom" | "sobe-ruim" | "desce-bom" | "desce-ruim" | "estavel";

export interface KpiCardProps {
  icon: LucideIcon;
  /** Classes do círculo do ícone (fundo + cor). */
  iconClassName?: string;
  label: string;
  valor: string;
  /** Texto de apoio abaixo do valor, ex.: "3 de 24 pessoas". */
  sub?: string;
  /** Rótulo curto da tendência, ex.: "+12 vs. mês passado". */
  tendencia?: string;
  tendenciaTipo?: Tendencia;
}

const TENDENCIA_STYLE: Record<
  Tendencia,
  { cor: string; icon: LucideIcon }
> = {
  "sobe-bom": { cor: "text-success-dark bg-success-light", icon: TrendingUp },
  "sobe-ruim": { cor: "text-danger bg-danger-light", icon: TrendingUp },
  "desce-bom": { cor: "text-success-dark bg-success-light", icon: TrendingDown },
  "desce-ruim": { cor: "text-danger bg-danger-light", icon: TrendingDown },
  estavel: { cor: "text-muted bg-page", icon: Minus },
};

/** Card de KPI agregado de saúde do time. */
export function KpiCard({
  icon: Icon,
  iconClassName = "bg-primary-light text-primary",
  label,
  valor,
  sub,
  tendencia,
  tendenciaTipo = "estavel",
}: KpiCardProps) {
  const estilo = TENDENCIA_STYLE[tendenciaTipo];
  const TendIcon = estilo.icon;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            iconClassName,
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </span>

        {tendencia && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
              estilo.cor,
            )}
          >
            <TendIcon className="h-3.5 w-3.5" strokeWidth={2.4} />
            {tendencia}
          </span>
        )}
      </div>

      <div>
        <div className="text-3xl font-bold tabular-nums text-ink">{valor}</div>
        <div className="mt-0.5 text-sm font-medium text-muted">{label}</div>
        {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
      </div>
    </div>
  );
}
