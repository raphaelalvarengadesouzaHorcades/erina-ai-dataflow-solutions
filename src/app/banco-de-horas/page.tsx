import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface Lancamento {
  data: string;
  diaSemana: string;
  horas: string;
  positivo: boolean;
  motivo: string;
}

const lancamentos: Lancamento[] = [
  { data: "11/07", diaSemana: "Sexta", horas: "+00:24", positivo: true, motivo: "Hora extra aprovada" },
  { data: "10/07", diaSemana: "Quinta", horas: "+00:35", positivo: true, motivo: "Reunião fora do expediente" },
  { data: "09/07", diaSemana: "Quarta", horas: "-00:40", positivo: false, motivo: "Saída antecipada" },
  { data: "08/07", diaSemana: "Terça", horas: "+00:33", positivo: true, motivo: "Entrega de sprint" },
  { data: "07/07", diaSemana: "Segunda", horas: "+00:40", positivo: true, motivo: "Hora extra aprovada" },
  { data: "04/07", diaSemana: "Sexta", horas: "+00:18", positivo: true, motivo: "Suporte a deploy" },
  { data: "03/07", diaSemana: "Quinta", horas: "-00:15", positivo: false, motivo: "Consulta médica" },
];

export default function BancoDeHorasPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-ink">Banco de horas</h1>
        <p className="mt-1 text-muted">
          Seu saldo acumulado de horas extras e compensações
        </p>
      </header>

      {/* Saldo em destaque + cards do mês */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border-soft bg-primary p-6 text-white shadow-sm lg:col-span-1">
          <div className="flex items-center gap-2 text-white/80">
            <Wallet className="h-4 w-4" strokeWidth={2.2} />
            <span className="text-sm font-medium">Saldo atual</span>
          </div>
          <div className="mt-3 text-4xl font-bold tabular-nums">+08:15</div>
          <p className="mt-2 text-sm text-white/80">
            Você tem crédito de horas para compensar quando precisar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">
          <div className="rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success-light text-success">
              <TrendingUp className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <div className="mt-4 text-sm font-medium text-muted">
              Horas positivas no mês
            </div>
            <div className="mt-1 text-3xl font-bold tabular-nums text-success">
              +11:20
            </div>
          </div>
          <div className="rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-danger/10 text-danger">
              <TrendingDown className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <div className="mt-4 text-sm font-medium text-muted">
              Horas negativas no mês
            </div>
            <div className="mt-1 text-3xl font-bold tabular-nums text-danger">
              -03:05
            </div>
          </div>
        </div>
      </div>

      {/* Lançamentos */}
      <div className="rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Lançamentos recentes</h2>
        <ul className="mt-4 flex flex-col divide-y divide-border-soft">
          {lancamentos.map((l, i) => (
            <li key={`${l.data}-${i}`} className="flex items-center gap-4 py-3">
              <div className="w-16 shrink-0">
                <div className="font-semibold text-ink">{l.data}</div>
                <div className="text-xs text-muted">{l.diaSemana}</div>
              </div>
              <div className="min-w-0 flex-1 text-sm text-ink">{l.motivo}</div>
              <div
                className={cn(
                  "shrink-0 tabular-nums text-base font-bold",
                  l.positivo ? "text-success" : "text-danger",
                )}
              >
                {l.horas}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
