"use client";

import { useShallow } from "zustand/react/shallow";
import { Calendar, Clock, Coffee, TrendingUp } from "lucide-react";
import {
  useJornadaStore,
  getProgressoMeta,
  getSaldoSegundos,
  getTotalPausasSegundos,
} from "@/store/useJornadaStore";
import { formatHM, formatHMSigned } from "@/lib/utils";
import { MiniStat } from "./MiniStat";
import { ProgressBar } from "./ProgressBar";

export function ResumoHoje() {
  // Campos crus reativos usados pelos derivados.
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

  const progresso = getProgressoMeta(snap);
  const progressoPct = Math.round(progresso * 100);
  const saldo = getSaldoSegundos(snap);
  const totalPausas = getTotalPausasSegundos(snap);

  function handleDetalhes() {
    useJornadaStore.getState().abrirChat();
  }

  return (
    <div className="rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-ink">Resumo de hoje</h2>
        <button
          type="button"
          onClick={handleDetalhes}
          className="text-sm font-medium text-primary transition-colors hover:text-primary-hover"
        >
          Ver detalhes
        </button>
      </div>

      {/* Grid de mini-cards */}
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Horas trabalhadas */}
        <MiniStat
          icon={Clock}
          iconClassName="bg-success-light text-success-dark"
          label="Horas trabalhadas"
          valor={formatHM(snap.segundosTrabalhados)}
          sub={`da meta de ${formatHM(snap.metaSegundos)}`}
        >
          <ProgressBar progresso={progresso} fillClassName="bg-primary" />
        </MiniStat>

        {/* Pausas */}
        <MiniStat
          icon={Coffee}
          iconClassName="bg-primary-light text-primary"
          label="Pausas"
          valor={String(snap.pausas.length)}
          sub={`${formatHM(totalPausas)} no total`}
        />

        {/* Meta do dia */}
        <MiniStat
          icon={Calendar}
          iconClassName="bg-primary-light text-primary"
          label="Meta do dia"
          valor={formatHM(snap.metaSegundos)}
          sub={`${progressoPct}% concluído`}
        >
          <ProgressBar progresso={progresso} fillClassName="bg-success" />
        </MiniStat>

        {/* Saldo do dia */}
        <MiniStat
          icon={TrendingUp}
          iconClassName={
            saldo >= 0
              ? "bg-success-light text-success-dark"
              : "bg-danger-light text-danger"
          }
          label="Saldo do dia"
          valor={formatHMSigned(saldo)}
          valorClassName={saldo >= 0 ? "text-success-dark" : "text-danger"}
          sub={saldo >= 0 ? "dentro da meta" : "acima da meta"}
        />
      </div>
    </div>
  );
}
