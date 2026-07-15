"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { chaveData, ORDEM_TIPOS, TIPOS, type Evento } from "./eventos";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface GradeMesProps {
  /** Primeiro dia do mês exibido. */
  mesVisivel: Date;
  hoje: Date;
  diaSelecionado: Date;
  eventosPorDia: Map<string, Evento[]>;
  onSelecionar: (data: Date) => void;
  onNavegar: (delta: number) => void;
  onHoje: () => void;
}

export function GradeMes({
  mesVisivel,
  hoje,
  diaSelecionado,
  eventosPorDia,
  onSelecionar,
  onNavegar,
  onHoje,
}: GradeMesProps) {
  const ano = mesVisivel.getFullYear();
  const mes = mesVisivel.getMonth();

  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();

  const kHoje = chaveData(hoje);
  const kSelecionado = chaveData(diaSelecionado);

  const titulo = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(mesVisivel);

  // Células: espaços em branco antes do dia 1 + os dias do mês.
  const celulas: Array<Date | null> = [
    ...Array.from({ length: primeiroDiaSemana }, () => null),
    ...Array.from({ length: diasNoMes }, (_, i) => new Date(ano, mes, i + 1)),
  ];

  return (
    <div className="rounded-2xl border border-border-soft bg-card p-4 shadow-sm sm:p-6">
      {/* Navegação de mês */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onNavegar(-1)}
            aria-label="Mês anterior"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-soft bg-card text-ink transition-colors hover:bg-primary-light hover:text-primary"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={() => onNavegar(1)}
            aria-label="Próximo mês"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-soft bg-card text-ink transition-colors hover:bg-primary-light hover:text-primary"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2.2} />
          </button>
        </div>

        <h2 className="text-lg font-semibold text-ink first-letter:uppercase">
          {titulo}
        </h2>

        <button
          type="button"
          onClick={onHoje}
          className="rounded-xl border border-border-soft bg-card px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-primary-light hover:text-primary"
        >
          Hoje
        </button>
      </div>

      {/* Cabeçalho dos dias da semana */}
      <div className="mb-1 grid grid-cols-7">
        {DIAS_SEMANA.map((dia) => (
          <div
            key={dia}
            className="py-2 text-center text-xs font-semibold uppercase tracking-wide text-muted"
          >
            {dia}
          </div>
        ))}
      </div>

      {/* Grade de dias */}
      <div className="grid grid-cols-7 gap-1">
        {celulas.map((data, i) => {
          if (!data) {
            return <div key={`vazio-${i}`} aria-hidden="true" />;
          }

          const chave = chaveData(data);
          const eventos = eventosPorDia.get(chave) ?? [];
          const ehHoje = chave === kHoje;
          const ehSelecionado = chave === kSelecionado;

          // Tipos únicos presentes no dia, em ordem consistente (até 4 pontos).
          const tiposPresentes = ORDEM_TIPOS.filter((t) =>
            eventos.some((ev) => ev.tipo === t),
          );

          return (
            <button
              key={chave}
              type="button"
              onClick={() => onSelecionar(data)}
              aria-label={`${data.getDate()} — ${eventos.length} evento(s)`}
              aria-pressed={ehSelecionado}
              className={cn(
                "flex aspect-square flex-col items-center justify-start gap-1 rounded-xl border p-1.5 text-sm transition-colors sm:p-2",
                ehSelecionado
                  ? "border-transparent bg-primary text-white"
                  : "border-transparent text-ink hover:bg-primary-light",
                !ehSelecionado && ehHoje && "border-primary/60",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold tabular-nums",
                  ehHoje && !ehSelecionado && "bg-primary text-white",
                  ehSelecionado && "text-white",
                )}
              >
                {data.getDate()}
              </span>

              {/* Pontos indicadores por tipo */}
              {tiposPresentes.length > 0 && (
                <span className="flex items-center gap-0.5">
                  {tiposPresentes.map((t) => (
                    <span
                      key={t}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        ehSelecionado ? "bg-white/80" : TIPOS[t].ponto,
                      )}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
