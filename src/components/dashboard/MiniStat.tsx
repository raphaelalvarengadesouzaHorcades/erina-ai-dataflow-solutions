import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MiniStatProps {
  icon: LucideIcon;
  /** Classes do círculo do ícone (fundo + cor), ex.: "bg-success-light text-success-dark" */
  iconClassName?: string;
  label: string;
  valor: string;
  valorClassName?: string;
  sub?: string;
  children?: React.ReactNode;
}

/**
 * Mini-card de estatística usado no "Resumo de hoje".
 */
export function MiniStat({
  icon: Icon,
  iconClassName = "bg-primary-light text-primary",
  label,
  valor,
  valorClassName,
  sub,
  children,
}: MiniStatProps) {
  return (
    <div className="rounded-xl border border-border-soft bg-page p-4">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            iconClassName,
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <span className="text-sm font-medium text-muted">{label}</span>
      </div>

      <div
        className={cn(
          "mt-3 text-2xl font-bold tabular-nums text-ink",
          valorClassName,
        )}
      >
        {valor}
      </div>

      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}

      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
