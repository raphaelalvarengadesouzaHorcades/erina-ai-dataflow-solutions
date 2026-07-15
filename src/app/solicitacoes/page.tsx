import { Plus, CalendarClock, Palmtree, ClipboardCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusSolicitacao = "pendente" | "aprovado" | "recusado";
type TipoSolicitacao = "abono" | "ajuste" | "ferias";

interface Solicitacao {
  tipo: TipoSolicitacao;
  titulo: string;
  detalhe: string;
  data: string;
  status: StatusSolicitacao;
}

const tipoConfig: Record<TipoSolicitacao, { icon: LucideIcon; className: string }> = {
  abono: { icon: ClipboardCheck, className: "bg-primary-light text-primary" },
  ajuste: { icon: CalendarClock, className: "bg-warning/15 text-warning" },
  ferias: { icon: Palmtree, className: "bg-success-light text-success" },
};

const statusConfig: Record<StatusSolicitacao, { label: string; className: string }> = {
  pendente: { label: "Pendente", className: "bg-warning/15 text-warning" },
  aprovado: { label: "Aprovado", className: "bg-success-light text-success" },
  recusado: { label: "Recusado", className: "bg-danger/10 text-danger" },
};

const solicitacoes: Solicitacao[] = [
  { tipo: "ajuste", titulo: "Ajuste de ponto", detalhe: "Esqueci de registrar a saída em 09/07", data: "10/07", status: "pendente" },
  { tipo: "ferias", titulo: "Férias", detalhe: "20 dias a partir de 04/08", data: "08/07", status: "aprovado" },
  { tipo: "abono", titulo: "Abono de falta", detalhe: "Consulta médica em 03/07 (atestado anexado)", data: "03/07", status: "aprovado" },
  { tipo: "ajuste", titulo: "Ajuste de ponto", detalhe: "Entrada registrada com horário errado em 28/06", data: "29/06", status: "recusado" },
  { tipo: "abono", titulo: "Abono de horas", detalhe: "Treinamento externo em 25/06", data: "24/06", status: "aprovado" },
];

export default function SolicitacoesPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">Solicitações</h1>
          <p className="mt-1 text-muted">
            Acompanhe seus pedidos de abono, ajuste de ponto e férias
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Nova solicitação
        </button>
      </header>

      {/* Resumo por status */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
          <div className="text-sm font-medium text-muted">Pendentes</div>
          <div className="mt-1 text-2xl font-bold text-warning">1</div>
        </div>
        <div className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
          <div className="text-sm font-medium text-muted">Aprovadas</div>
          <div className="mt-1 text-2xl font-bold text-success">3</div>
        </div>
        <div className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
          <div className="text-sm font-medium text-muted">Recusadas</div>
          <div className="mt-1 text-2xl font-bold text-danger">1</div>
        </div>
      </div>

      {/* Lista */}
      <div className="rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Meus pedidos</h2>
        <ul className="mt-4 flex flex-col gap-2">
          {solicitacoes.map((s, i) => {
            const tcfg = tipoConfig[s.tipo];
            const Icon = tcfg.icon;
            return (
              <li
                key={`${s.titulo}-${i}`}
                className="flex items-center gap-4 rounded-xl border border-border-soft bg-page p-4"
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    tcfg.className,
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-ink">{s.titulo}</div>
                  <div className="truncate text-sm text-muted">{s.detalhe}</div>
                </div>
                <div className="hidden shrink-0 text-xs text-muted sm:block">
                  {s.data}
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
                    statusConfig[s.status].className,
                  )}
                >
                  {statusConfig[s.status].label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
