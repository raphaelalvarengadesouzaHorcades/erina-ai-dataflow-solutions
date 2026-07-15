import { CalendarDays, Clock, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusJornada = "completa" | "em-andamento" | "incompleta";

interface Jornada {
  data: string;
  diaSemana: string;
  inicio: string;
  fim: string;
  horas: string;
  pausas: number;
  status: StatusJornada;
}

const jornadas: Jornada[] = [
  { data: "14/07", diaSemana: "Segunda", inicio: "09:02", fim: "—", horas: "05:48", pausas: 1, status: "em-andamento" },
  { data: "11/07", diaSemana: "Sexta", inicio: "08:58", fim: "18:12", horas: "08:24", pausas: 3, status: "completa" },
  { data: "10/07", diaSemana: "Quinta", inicio: "09:05", fim: "18:30", horas: "08:35", pausas: 2, status: "completa" },
  { data: "09/07", diaSemana: "Quarta", inicio: "09:00", fim: "17:20", horas: "07:20", pausas: 2, status: "incompleta" },
  { data: "08/07", diaSemana: "Terça", inicio: "08:47", fim: "18:05", horas: "08:33", pausas: 3, status: "completa" },
  { data: "07/07", diaSemana: "Segunda", inicio: "09:10", fim: "18:40", horas: "08:40", pausas: 2, status: "completa" },
  { data: "04/07", diaSemana: "Sexta", inicio: "08:55", fim: "17:58", horas: "08:18", pausas: 3, status: "completa" },
];

const statusConfig: Record<StatusJornada, { label: string; className: string }> = {
  completa: { label: "Completa", className: "bg-success-light text-success" },
  "em-andamento": { label: "Em andamento", className: "bg-primary-light text-primary" },
  incompleta: { label: "Incompleta", className: "bg-danger/10 text-danger" },
};

export default function JornadasPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-ink">Jornadas</h1>
        <p className="mt-1 text-muted">
          Histórico dos seus últimos dias de trabalho registrados
        </p>
      </header>

      {/* Resumo rápido */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-muted">
            <CalendarDays className="h-4 w-4" strokeWidth={2.2} />
            <span className="text-sm font-medium">Dias trabalhados</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-ink">7 dias</div>
        </div>
        <div className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-muted">
            <Clock className="h-4 w-4" strokeWidth={2.2} />
            <span className="text-sm font-medium">Horas na semana</span>
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums text-ink">41:30</div>
        </div>
        <div className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-muted">
            <Coffee className="h-4 w-4" strokeWidth={2.2} />
            <span className="text-sm font-medium">Média de pausas/dia</span>
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums text-ink">2,3</div>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-2xl border border-border-soft bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border-soft text-xs uppercase tracking-wide text-muted">
                <th className="px-6 py-4 font-semibold">Data</th>
                <th className="px-6 py-4 font-semibold">Início</th>
                <th className="px-6 py-4 font-semibold">Fim</th>
                <th className="px-6 py-4 font-semibold">Horas</th>
                <th className="px-6 py-4 font-semibold">Pausas</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {jornadas.map((j) => (
                <tr
                  key={j.data}
                  className="border-b border-border-soft last:border-0 transition-colors hover:bg-page"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-ink">{j.data}</div>
                    <div className="text-xs text-muted">{j.diaSemana}</div>
                  </td>
                  <td className="px-6 py-4 tabular-nums text-ink">{j.inicio}</td>
                  <td className="px-6 py-4 tabular-nums text-ink">{j.fim}</td>
                  <td className="px-6 py-4 font-semibold tabular-nums text-ink">{j.horas}</td>
                  <td className="px-6 py-4 tabular-nums text-muted">{j.pausas}</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                        statusConfig[j.status].className,
                      )}
                    >
                      {statusConfig[j.status].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
