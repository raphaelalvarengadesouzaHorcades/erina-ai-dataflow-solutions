"use client";

import type { LucideIcon } from "lucide-react";
import {
  Flame,
  Timer,
  Users,
  BellRing,
  MessageCircle,
  Shuffle,
  LogOut,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Nivel = "danger" | "warning";

interface Alerta {
  id: string;
  icon: LucideIcon;
  nivel: Nivel;
  /** Nome de quem está na situação (aqui só há jornada — nunca vigilância). */
  quem: string;
  /** Situação objetiva de jornada / hora extra. */
  situacao: string;
  /** Métrica de destaque (horas). */
  destaque: string;
  acao: { icon: LucideIcon; texto: string };
}

/* Dados MOCKADOS — apenas horas e hora extra, com enquadramento protetivo. */
const ALERTAS: Alerta[] = [
  {
    id: "carlos-extra",
    icon: Flame,
    nivel: "danger",
    quem: "Carlos Mendes",
    situacao: "está em hora extra hoje",
    destaque: "09:12",
    acao: {
      icon: Shuffle,
      texto: "Redistribuir a carga do dia e liberar mais cedo amanhã",
    },
  },
  {
    id: "marina-limite",
    icon: Timer,
    nivel: "warning",
    quem: "Marina Alves",
    situacao: "está a ~20 min do limite diário (07:40)",
    destaque: "07:40",
    acao: {
      icon: MessageCircle,
      texto: "Um aviso amigável para ela encerrar o dia no horário",
    },
  },
  {
    id: "produto-semana",
    icon: Users,
    nivel: "warning",
    quem: "Time de Produto",
    situacao: "3 pessoas acima de 44h nesta semana",
    destaque: "+44h",
    acao: {
      icon: LogOut,
      texto: "Revisar prazos e compensar as horas ainda nesta semana",
    },
  },
];

const NIVEL_STYLE: Record<
  Nivel,
  {
    card: string;
    iconWrap: string;
    chip: string;
    chipLabel: string;
    destaque: string;
  }
> = {
  danger: {
    card: "border-danger/30 bg-danger-light/50",
    iconWrap: "bg-danger text-white",
    chip: "bg-danger-light text-danger",
    chipLabel: "Hora extra",
    destaque: "text-danger",
  },
  warning: {
    card: "border-warning/30 bg-warning/10",
    iconWrap: "bg-warning text-white",
    chip: "bg-warning/15 text-warning",
    chipLabel: "Perto do limite",
    destaque: "text-warning",
  },
};

export function AlertasGestor() {
  return (
    <section className="rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
            <BellRing className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div>
            <h3 className="text-base font-bold text-ink">Alertas do gestor</h3>
            <p className="mt-0.5 text-sm text-muted">
              Ações para proteger a equipe do excesso de jornada e cumprir a CLT
              — cada alerta traz uma sugestão de cuidado.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-light px-3 py-1 text-xs font-semibold text-success-dark">
          <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.4} />
          Só horas — nunca vigilância
        </span>
      </div>

      <ul className="mt-5 flex flex-col gap-3">
        {ALERTAS.map((a) => {
          const estilo = NIVEL_STYLE[a.nivel];
          const Icone = a.icon;
          const AcaoIcon = a.acao.icon;
          return (
            <li
              key={a.id}
              className={cn(
                "flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center",
                estilo.card,
              )}
            >
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-sm",
                  estilo.iconWrap,
                )}
              >
                <Icone className="h-5 w-5" strokeWidth={2.3} />
              </span>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm text-ink">
                    <strong className="font-bold">{a.quem}</strong>{" "}
                    {a.situacao} —{" "}
                    <span
                      className={cn(
                        "font-bold tabular-nums",
                        estilo.destaque,
                      )}
                    >
                      {a.destaque}
                    </span>
                    .
                  </p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide",
                      estilo.chip,
                    )}
                  >
                    {estilo.chipLabel}
                  </span>
                </div>

                <div className="mt-2.5 flex items-start gap-2 rounded-lg bg-card/70 px-3 py-2">
                  <AcaoIcon
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    strokeWidth={2.3}
                  />
                  <span className="text-sm font-medium text-ink/85">
                    <span className="font-semibold text-primary">
                      Ação sugerida:
                    </span>{" "}
                    {a.acao.texto}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
