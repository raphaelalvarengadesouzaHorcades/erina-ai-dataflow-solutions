import { Coffee, UtensilsCrossed, Armchair, Timer, Hourglass } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type TipoPausa = "cafe" | "almoco" | "descanso";

interface Pausa {
  data: string;
  diaSemana: string;
  inicio: string;
  fim: string;
  duracao: string;
  tipo: TipoPausa;
}

const tipoConfig: Record<
  TipoPausa,
  { label: string; icon: LucideIcon; className: string }
> = {
  cafe: { label: "Café", icon: Coffee, className: "bg-warning/15 text-warning" },
  almoco: { label: "Almoço", icon: UtensilsCrossed, className: "bg-primary-light text-primary" },
  descanso: { label: "Descanso", icon: Armchair, className: "bg-success-light text-success" },
};

const pausas: Pausa[] = [
  { data: "14/07", diaSemana: "Segunda", inicio: "11:00", fim: "11:12", duracao: "12 min", tipo: "cafe" },
  { data: "11/07", diaSemana: "Sexta", inicio: "12:30", fim: "13:30", duracao: "60 min", tipo: "almoco" },
  { data: "11/07", diaSemana: "Sexta", inicio: "10:15", fim: "10:25", duracao: "10 min", tipo: "cafe" },
  { data: "11/07", diaSemana: "Sexta", inicio: "16:00", fim: "16:15", duracao: "15 min", tipo: "descanso" },
  { data: "10/07", diaSemana: "Quinta", inicio: "12:45", fim: "13:40", duracao: "55 min", tipo: "almoco" },
  { data: "10/07", diaSemana: "Quinta", inicio: "15:30", fim: "15:42", duracao: "12 min", tipo: "cafe" },
  { data: "09/07", diaSemana: "Quarta", inicio: "12:30", fim: "13:25", duracao: "55 min", tipo: "almoco" },
  { data: "08/07", diaSemana: "Terça", inicio: "16:20", fim: "16:35", duracao: "15 min", tipo: "descanso" },
];

export default function PausasPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-ink">Pausas</h1>
        <p className="mt-1 text-muted">
          Acompanhe seus intervalos de café, almoço e descanso
        </p>
      </header>

      {/* Resumo */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-muted">
            <Timer className="h-4 w-4" strokeWidth={2.2} />
            <span className="text-sm font-medium">Total na semana</span>
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums text-ink">04:14</div>
          <div className="mt-0.5 text-xs text-muted">em 13 pausas</div>
        </div>
        <div className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-muted">
            <Hourglass className="h-4 w-4" strokeWidth={2.2} />
            <span className="text-sm font-medium">Duração média</span>
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums text-ink">19 min</div>
          <div className="mt-0.5 text-xs text-muted">por pausa</div>
        </div>
        <div className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-muted">
            <Coffee className="h-4 w-4" strokeWidth={2.2} />
            <span className="text-sm font-medium">Pausa mais comum</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-ink">Café</div>
          <div className="mt-0.5 text-xs text-muted">7 registros</div>
        </div>
      </div>

      {/* Lista de pausas */}
      <div className="rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Pausas recentes</h2>
        <ul className="mt-4 flex flex-col gap-2">
          {pausas.map((p, i) => {
            const cfg = tipoConfig[p.tipo];
            const Icon = cfg.icon;
            return (
              <li
                key={`${p.data}-${p.inicio}-${i}`}
                className="flex items-center gap-4 rounded-xl border border-border-soft bg-page p-4"
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    cfg.className,
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-ink">{cfg.label}</div>
                  <div className="text-xs text-muted">
                    {p.diaSemana}, {p.data}
                  </div>
                </div>
                <div className="text-right">
                  <div className="tabular-nums text-sm font-medium text-ink">
                    {p.inicio} – {p.fim}
                  </div>
                  <div className="text-xs text-muted">{p.duracao}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
