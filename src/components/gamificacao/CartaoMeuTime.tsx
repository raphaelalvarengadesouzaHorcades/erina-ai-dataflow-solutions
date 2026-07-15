"use client";

import { ArrowUp, Sparkles, Trophy } from "lucide-react";
import {
  getInfoMeuTime,
  useGamificacaoStore,
} from "@/store/useGamificacaoStore";

const ORDINAIS = ["", "1º", "2º", "3º", "4º", "5º"] as const;

function ordinal(posicao: number): string {
  return ORDINAIS[posicao] ?? `${posicao}º`;
}

/**
 * Cartão motivador do time da usuária: posição atual, pontos e quanto falta
 * para subir de posição — sempre no tom leve e acolhedor da Erina.
 */
export function CartaoMeuTime() {
  const times = useGamificacaoStore((s) => s.times);
  const info = getInfoMeuTime(times);

  if (!info) return null;

  const { meuTime, timeAcima, pontosParaSubir } = info;

  const mensagem =
    timeAcima && pontosParaSubir > 0
      ? `Faltam ${pontosParaSubir} pontos para ultrapassar o ${timeAcima.nome} ${timeAcima.emoji}! Bora tomar uma água juntas? 💧`
      : "Seu time está no topo do bem-estar! Continuem cuidando de vocês — sem pressão, só carinho. 💜";

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary-light p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
            {meuTime.emoji}
          </span>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.4} />
              Seu time
            </div>
            <h2 className="text-lg font-bold text-ink">{meuTime.nome}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
          <Trophy className="h-4 w-4 text-warning" strokeWidth={2.2} />
          <span className="text-sm font-bold text-ink tabular-nums">
            {ordinal(meuTime.posicao)} lugar
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-2">
        <div>
          <div className="text-xs font-medium text-muted">
            Pontos de bem-estar do time
          </div>
          <div className="text-3xl font-bold text-ink tabular-nums">
            {meuTime.pontos.toLocaleString("pt-BR")}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-muted">Membros cuidando</div>
          <div className="text-3xl font-bold text-ink tabular-nums">
            {meuTime.membros}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl bg-white/70 p-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <ArrowUp className="h-4 w-4" strokeWidth={2.6} />
        </span>
        <p className="text-sm font-medium leading-relaxed text-ink">
          {mensagem}
        </p>
      </div>
    </div>
  );
}
