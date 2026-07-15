"use client";

import { useShallow } from "zustand/react/shallow";
import { CheckCircle2, Info, ShieldCheck, XCircle } from "lucide-react";
import { useJornadaStore, getStatusCLT } from "@/store/useJornadaStore";
import { cn } from "@/lib/utils";

export function StatusCLTCard() {
  // Seleciona os campos crus usados por getStatusCLT (reativo, sem loop).
  const snap = useJornadaStore(
    useShallow((s) => ({
      jornadaStatus: s.jornadaStatus,
      segundosTrabalhados: s.segundosTrabalhados,
      metaSegundos: s.metaSegundos,
      baselineSaldoSegundos: s.baselineSaldoSegundos,
      pausas: s.pausas,
      segundosDesdeUltimaAgua: s.segundosDesdeUltimaAgua,
      segundosSentada: s.segundosSentada,
      segundosDesdeUltimaPausa: s.segundosDesdeUltimaPausa,
    })),
  );

  const status = getStatusCLT(snap);

  const tituloCor = status.conforme ? "text-success-dark" : "text-danger";

  function handleDetalhes() {
    useJornadaStore.getState().abrirChat();
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-ink">Status CLT</h2>
        <Info className="h-4 w-4 text-muted" />
      </div>

      {/* Selo */}
      <div className="mt-5 flex flex-col items-center text-center">
        <span
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full",
            status.conforme ? "bg-success-light" : "bg-danger-light",
          )}
        >
          <ShieldCheck
            className={cn(
              "h-8 w-8",
              status.conforme ? "text-success-dark" : "text-danger",
            )}
            strokeWidth={2.2}
          />
        </span>
        <p className={cn("mt-3 text-lg font-bold", tituloCor)}>
          {status.titulo}
        </p>
        <p className="mt-1 text-sm text-muted">{status.descricao}</p>
      </div>

      {/* Checklist */}
      <ul className="mt-5 space-y-2.5">
        {status.itens.map((item) => (
          <li key={item.label} className="flex items-center gap-2.5">
            {item.ok ? (
              <CheckCircle2
                className="h-5 w-5 shrink-0 text-success"
                strokeWidth={2.2}
              />
            ) : (
              <XCircle
                className="h-5 w-5 shrink-0 text-danger"
                strokeWidth={2.2}
              />
            )}
            <span className="text-sm text-ink">{item.label}</span>
          </li>
        ))}
      </ul>

      {/* Botão */}
      <button
        type="button"
        onClick={handleDetalhes}
        className="mt-6 w-full rounded-xl bg-page px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-primary-light hover:text-primary"
      >
        Ver detalhes do status
      </button>
    </div>
  );
}
