import { cn } from "@/lib/utils";

interface ProgressBarProps {
  /** Progresso normalizado 0..1 */
  progresso: number;
  /** Classe de cor do preenchimento (ex.: "bg-primary", "bg-success") */
  fillClassName?: string;
  className?: string;
}

/**
 * Barra de progresso simples: trilho neutro + preenchimento colorido.
 */
export function ProgressBar({
  progresso,
  fillClassName = "bg-primary",
  className,
}: ProgressBarProps) {
  const pct = Math.round(Math.min(1, Math.max(0, progresso)) * 100);
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-border-soft",
        className,
      )}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full transition-all", fillClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
