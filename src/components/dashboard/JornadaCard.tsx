"use client";

import { Pause, Play, StopCircle } from "lucide-react";
import { useJornadaStore } from "@/store/useJornadaStore";
import { formatHMS, cn } from "@/lib/utils";

/** Bloco de um grupo do cronômetro (horas / minutos / segundos). */
function TimeGroup({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-6xl font-bold tabular-nums leading-none text-ink sm:text-7xl">
        {value}
      </span>
      <span className="mt-2 text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </span>
    </div>
  );
}

function Separador() {
  return (
    <span className="text-5xl font-bold leading-none text-border-soft sm:text-6xl">
      :
    </span>
  );
}

/** Formata uma duração curta em MM:SS (ou HH:MM:SS quando passa de 1h). */
function formatMMSS(totalSegundos: number): string {
  const s = Math.max(0, Math.floor(totalSegundos));
  if (s >= 3600) return formatHMS(s);
  const minutos = Math.floor(s / 60);
  const segundos = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(minutos)}:${pad(segundos)}`;
}

export function JornadaCard() {
  // Leituras primitivas reativas — o tick global incrementa segundosTrabalhados.
  const jornadaStatus = useJornadaStore((s) => s.jornadaStatus);
  const inicioLabel = useJornadaStore((s) => s.inicioLabel);
  const segundosTrabalhados = useJornadaStore((s) => s.segundosTrabalhados);
  const segundosPausaAtual = useJornadaStore((s) => s.segundosPausaAtual);
  const metaPausaSegundos = useJornadaStore((s) => s.metaPausaSegundos);

  const [hh, mm, ss] = formatHMS(segundosTrabalhados).split(":");

  const emPausa = jornadaStatus === "em_pausa";
  const encerrada = jornadaStatus === "encerrada";

  // Painel de pausa: decorrido, quanto falta e progresso rumo à meta.
  const excedeuPausa = segundosPausaAtual > metaPausaSegundos;
  const restantePausa = Math.max(0, metaPausaSegundos - segundosPausaAtual);
  const excessoPausa = Math.max(0, segundosPausaAtual - metaPausaSegundos);
  const progressoPausa =
    metaPausaSegundos > 0
      ? Math.min(1, segundosPausaAtual / metaPausaSegundos)
      : 0;

  const statusTexto = emPausa
    ? "Em pausa"
    : encerrada
      ? "Jornada encerrada"
      : "Jornada em andamento";

  const statusCor = emPausa
    ? "text-warning"
    : encerrada
      ? "text-muted"
      : "text-ink";

  const pontoCor = emPausa
    ? "bg-warning"
    : encerrada
      ? "bg-muted"
      : "bg-success";

  function handlePausa() {
    const store = useJornadaStore.getState();
    if (store.jornadaStatus === "em_pausa") {
      store.encerrarPausa();
    } else {
      store.iniciarPausa();
    }
  }

  function handleEncerrar() {
    useJornadaStore.getState().encerrarJornada();
  }

  function handleIniciar() {
    useJornadaStore.getState().iniciarJornada();
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
      {/* Status */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          {!encerrada && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                pontoCor,
              )}
            />
          )}
          <span
            className={cn(
              "relative inline-flex h-2.5 w-2.5 rounded-full",
              pontoCor,
            )}
          />
        </span>
        <span className={cn("text-sm font-semibold", statusCor)}>
          {statusTexto}
        </span>
        {!encerrada && (
          <span className="text-sm text-muted">· Desde {inicioLabel}</span>
        )}
      </div>

      {/* Área central: painel de pausa OU cronômetro da jornada */}
      {emPausa ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 py-8">
          {/* Cronômetro da pausa */}
          <div className="flex flex-col items-center">
            <span className="text-6xl font-bold tabular-nums leading-none text-warning sm:text-7xl">
              {formatHMS(segundosPausaAtual)}
            </span>
            <span className="mt-2 text-xs font-medium uppercase tracking-wide text-muted">
              em pausa
            </span>
          </div>

          {/* Quanto falta / excesso + barra de progresso */}
          <div className="w-full max-w-xs">
            {excedeuPausa ? (
              <p className="text-center text-sm font-semibold text-warning">
                Pausa {formatMMSS(excessoPausa)} acima do recomendado
              </p>
            ) : (
              <p className="text-center text-sm font-medium text-muted">
                Faltam{" "}
                <span className="tabular-nums font-semibold text-ink">
                  {formatMMSS(restantePausa)}
                </span>
              </p>
            )}

            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border-soft">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-500 ease-out",
                  excedeuPausa ? "bg-warning" : "bg-primary",
                )}
                style={{ width: `${(excedeuPausa ? 1 : progressoPausa) * 100}%` }}
              />
            </div>

            <p className="mt-1.5 text-center text-xs text-muted">
              Meta recomendada: {formatMMSS(metaPausaSegundos)}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="flex items-start gap-3 sm:gap-5">
            <TimeGroup value={hh} label="horas" />
            <div className="pt-2">
              <Separador />
            </div>
            <TimeGroup value={mm} label="minutos" />
            <div className="pt-2">
              <Separador />
            </div>
            <TimeGroup value={ss} label="segundos" />
          </div>
        </div>
      )}

      {/* Botões */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {encerrada ? (
          <button
            type="button"
            onClick={handleIniciar}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            <Play className="h-4 w-4" strokeWidth={2.4} />
            Iniciar jornada
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handlePausa}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-light px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
            >
              {emPausa ? (
                <>
                  <Play className="h-4 w-4" strokeWidth={2.4} />
                  Encerrar pausa
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4" strokeWidth={2.4} />
                  Iniciar pausa
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleEncerrar}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-danger px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-danger/90"
            >
              <StopCircle className="h-4 w-4" strokeWidth={2.4} />
              Encerrar jornada
            </button>
          </>
        )}
      </div>
    </div>
  );
}
