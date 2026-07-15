"use client";

import { useState } from "react";
import { Plus, Trash2, X, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ORDEM_TIPOS,
  TIPOS,
  ordenarPorHorario,
  type Evento,
  type TipoEvento,
} from "./eventos";

interface PainelDiaProps {
  data: Date;
  hoje: Date;
  eventos: Evento[];
  onAdicionar: (dados: { titulo: string; horario: string; tipo: TipoEvento }) => void;
  onRemover: (id: string) => void;
}

export function PainelDia({
  data,
  hoje,
  eventos,
  onAdicionar,
  onRemover,
}: PainelDiaProps) {
  const [formAberto, setFormAberto] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [horario, setHorario] = useState("09:00");
  const [tipo, setTipo] = useState<TipoEvento>("tarefa");

  const ordenados = ordenarPorHorario(eventos);

  const dataLonga = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(data);

  const ehHoje =
    data.getFullYear() === hoje.getFullYear() &&
    data.getMonth() === hoje.getMonth() &&
    data.getDate() === hoje.getDate();

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const limpo = titulo.trim();
    if (!limpo) return;
    onAdicionar({ titulo: limpo, horario, tipo });
    setTitulo("");
    setHorario("09:00");
    setTipo("tarefa");
    setFormAberto(false);
  }

  return (
    <div className="flex flex-col rounded-2xl border border-border-soft bg-card p-4 shadow-sm sm:p-6">
      {/* Cabeçalho do dia */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {ehHoje ? "Hoje" : "Dia selecionado"}
          </p>
          <h2 className="mt-0.5 text-lg font-semibold leading-tight text-ink first-letter:uppercase">
            {dataLonga}
          </h2>
          <p className="mt-0.5 text-sm text-muted">
            {ordenados.length === 0
              ? "Nenhum evento"
              : `${ordenados.length} evento${ordenados.length > 1 ? "s" : ""}`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setFormAberto((v) => !v)}
          aria-expanded={formAberto}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
            formAberto
              ? "border border-border-soft bg-card text-ink hover:bg-primary-light hover:text-primary"
              : "bg-primary text-white hover:bg-primary-hover",
          )}
        >
          {formAberto ? (
            <>
              <X className="h-4 w-4" strokeWidth={2.2} />
              Cancelar
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" strokeWidth={2.2} />
              Adicionar
            </>
          )}
        </button>
      </div>

      {/* Formulário inline */}
      {formAberto && (
        <form
          onSubmit={enviar}
          className="mb-4 space-y-3 rounded-xl border border-border-soft bg-page/40 p-3"
        >
          <div>
            <label
              htmlFor="evento-titulo"
              className="mb-1 block text-xs font-semibold text-muted"
            >
              Título
            </label>
            <input
              id="evento-titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex.: Reunião com o time"
              autoFocus
              className="w-full rounded-lg border border-border-soft bg-card px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex gap-3">
            <div className="w-28">
              <label
                htmlFor="evento-horario"
                className="mb-1 block text-xs font-semibold text-muted"
              >
                Horário
              </label>
              <input
                id="evento-horario"
                type="time"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                className="w-full rounded-lg border border-border-soft bg-card px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="flex-1">
              <label
                htmlFor="evento-tipo"
                className="mb-1 block text-xs font-semibold text-muted"
              >
                Tipo
              </label>
              <select
                id="evento-tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoEvento)}
                className="w-full rounded-lg border border-border-soft bg-card px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {ORDEM_TIPOS.map((t) => (
                  <option key={t} value={t}>
                    {TIPOS[t].rotulo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={!titulo.trim()}
            className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            Salvar evento
          </button>
        </form>
      )}

      {/* Lista de eventos */}
      {ordenados.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-soft px-4 py-10 text-center">
          <CalendarDays className="h-8 w-8 text-muted" strokeWidth={1.8} />
          <p className="text-sm font-medium text-ink">Dia livre</p>
          <p className="text-xs text-muted">
            Use &quot;Adicionar&quot; para marcar um evento neste dia.
          </p>
        </div>
      ) : (
        <ol className="space-y-2">
          {ordenados.map((evento) => {
            const config = TIPOS[evento.tipo];
            const Icone = config.icone;
            return (
              <li
                key={evento.id}
                className="group flex items-center gap-3 rounded-xl border border-border-soft bg-card px-3 py-2.5"
              >
                <span className="w-12 shrink-0 text-sm font-semibold tabular-nums text-muted">
                  {evento.horario}
                </span>

                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    config.chip,
                  )}
                >
                  <Icone className="h-4.5 w-4.5" strokeWidth={2.2} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{evento.titulo}</p>
                  <p className="text-xs text-muted">
                    {config.rotulo}
                    {evento.duracao ? ` · ${evento.duracao}` : ""}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onRemover(evento.id)}
                  aria-label={`Remover ${evento.titulo}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-danger-light hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
