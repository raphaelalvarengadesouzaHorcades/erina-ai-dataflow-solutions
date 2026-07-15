"use client";

import { Coffee, Droplets, HeartPulse, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getRankingTimes,
  type TimeRanqueado,
  useGamificacaoStore,
} from "@/store/useGamificacaoStore";

/** Medalha do pódio; posições fora do top 3 mostram só o número. */
const MEDALHAS: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

interface MiniHabitoProps {
  icon: typeof Droplets;
  valor: number;
  cor: string;
  rotulo: string;
}

function MiniHabito({ icon: Icon, valor, cor, rotulo }: MiniHabitoProps) {
  return (
    <span
      className="flex items-center gap-1 text-xs font-medium text-muted tabular-nums"
      title={rotulo}
    >
      <Icon className={cn("h-3.5 w-3.5", cor)} strokeWidth={2.2} />
      {valor}
    </span>
  );
}

function LinhaTime({
  time,
  pontosLider,
}: {
  time: TimeRanqueado;
  pontosLider: number;
}) {
  const medalha = MEDALHAS[time.posicao];
  const larguraBarra =
    pontosLider > 0 ? Math.round((time.pontos / pontosLider) * 100) : 0;

  return (
    <li
      className={cn(
        "rounded-xl border p-4 transition-colors",
        time.ehMeuTime
          ? "border-primary/40 bg-primary-light ring-1 ring-primary/20"
          : "border-border-soft bg-page",
      )}
    >
      <div className="flex items-center gap-3">
        {/* Posição / medalha */}
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base font-bold tabular-nums",
            medalha
              ? "bg-white shadow-sm"
              : "bg-border-soft text-muted",
          )}
        >
          {medalha ?? time.posicao}
        </span>

        {/* Emoji + nome */}
        <span className="text-xl" aria-hidden>
          {time.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "truncate text-sm font-bold",
                time.ehMeuTime ? "text-primary" : "text-ink",
              )}
            >
              {time.nome}
            </span>
            {time.ehMeuTime && (
              <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                Seu time
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 text-xs text-muted">
            <Users className="h-3 w-3" strokeWidth={2.2} />
            {time.membros} membros
          </span>
        </div>

        {/* Pontos */}
        <div className="shrink-0 text-right">
          <div className="text-base font-bold text-ink tabular-nums">
            {time.pontos.toLocaleString("pt-BR")}
          </div>
          <div className="text-[11px] text-muted">pontos</div>
        </div>
      </div>

      {/* Barra de comparação (relativa ao líder) */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border-soft">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            time.ehMeuTime ? "bg-primary" : "bg-success",
          )}
          style={{ width: `${larguraBarra}%` }}
        />
      </div>

      {/* Mini-detalhe dos hábitos do time */}
      <div className="mt-3 flex items-center gap-4">
        <MiniHabito
          icon={Droplets}
          valor={time.aguas}
          cor="text-primary"
          rotulo="Águas registradas pelo time"
        />
        <MiniHabito
          icon={Coffee}
          valor={time.pausas}
          cor="text-warning"
          rotulo="Pausas registradas pelo time"
        />
        <MiniHabito
          icon={HeartPulse}
          valor={time.alongamentos}
          cor="text-success-dark"
          rotulo="Alongamentos registrados pelo time"
        />
      </div>
    </li>
  );
}

/**
 * Ranking de Times: leaderboard de competição saudável por bem-estar.
 * Ordena os times por pontos, destaca o pódio e o time da usuária.
 */
export function RankingTimes() {
  const times = useGamificacaoStore((s) => s.times);
  const ranking = getRankingTimes(times);
  const pontosLider = ranking[0]?.pontos ?? 0;

  return (
    <div className="rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-ink">Ranking de Times</h2>
        <span className="rounded-full bg-success-light px-3 py-1 text-xs font-semibold text-success-dark">
          Competição saudável 💚
        </span>
      </div>
      <p className="mb-4 text-sm text-muted">
        Aqui os times competem por quem cuida melhor de si — água 💧, pausas ☕ e
        alongamentos 🧘. É sobre bem-estar em grupo, não sobre produção.
      </p>

      <ol className="flex flex-col gap-3">
        {ranking.map((time) => (
          <LinhaTime key={time.id} time={time} pontosLider={pontosLider} />
        ))}
      </ol>
    </div>
  );
}
