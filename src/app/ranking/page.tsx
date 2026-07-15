import { CartaoMeuTime } from "@/components/gamificacao/CartaoMeuTime";
import { RankingTimes } from "@/components/gamificacao/RankingTimes";

export default function RankingPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <header>
        <h1 className="text-3xl font-bold text-ink">Ranking de Times</h1>
        <p className="mt-1 text-muted">
          Uma competição saudável de bem-estar: os times somam pontos cuidando
          de si — água 💧, pausas ☕ e alongamentos 🧘. É sobre cuidar em grupo,
          nunca sobre produção.
        </p>
      </header>

      {/* Destaque do meu time (1 col) + leaderboard (2 col) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <CartaoMeuTime />
        </div>
        <div className="lg:col-span-2">
          <RankingTimes />
        </div>
      </div>
    </div>
  );
}
