"use client";

import { useGamificacaoStore, getEstagioMascote } from "@/store/useGamificacaoStore";
import { MascotePlantinha } from "./MascotePlantinha";
import { ErinaAvatar } from "@/components/erina/ErinaAvatar";

const LEGENDAS_POR_ESTAGIO = [
  "Toda planta começa como um broto. Você também. Um cuidado de cada vez.",
  "Olha ela crescendo! Cada gole de água e cada pausa viram folhinha nova.",
  "Sua plantinha está cheia de vida — assim como você quando se cuida.",
  "Floresceu! Isso é reflexo de você respeitando seus limites. 🌸",
  "Plena e radiante! Você provou que bem-estar e trabalho andam juntos.",
];

const NOME_POR_ESTAGIO = [
  "Broto",
  "Muda",
  "Plantinha",
  "Plantinha florida",
  "Jardim pleno",
];

/**
 * Cartão do mascote que cresce com os pontos. Mostra o estágio coerente com
 * o nível atual + uma legenda fofa da Erina.
 */
export function CartaoMascote() {
  const nivel = useGamificacaoStore((s) => s.nivel);
  const pontos = useGamificacaoStore((s) => s.pontos);
  const xp = useGamificacaoStore((s) => s.xp);
  const streakDias = useGamificacaoStore((s) => s.streakDias);
  const habitos = useGamificacaoStore((s) => s.habitos);

  const estagio = getEstagioMascote({ pontos, nivel, xp, streakDias, habitos });
  const legenda = LEGENDAS_POR_ESTAGIO[estagio];
  const nomeEstagio = NOME_POR_ESTAGIO[estagio];

  return (
    <div className="flex h-full flex-col items-center rounded-2xl border border-border-soft bg-card p-6 text-center shadow-sm">
      <h2 className="self-start text-sm font-semibold text-muted">
        Sua plantinha do bem-estar
      </h2>

      {/* palco do mascote */}
      <div className="mt-2 flex flex-1 items-center justify-center">
        <div className="rounded-full bg-primary-light/60 p-2">
          <MascotePlantinha estagio={estagio} size={180} />
        </div>
      </div>

      <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-success-light px-3 py-1 text-xs font-semibold text-success-dark">
        {nomeEstagio} · estágio {estagio + 1}/5
      </span>

      {/* legenda da Erina */}
      <div className="mt-4 flex items-start gap-3 rounded-xl bg-primary-light p-3 text-left">
        <span className="shrink-0">
          <ErinaAvatar size={32} />
        </span>
        <p className="text-sm leading-snug text-ink">
          <span className="font-semibold text-primary">Erina:</span> {legenda}
        </p>
      </div>
    </div>
  );
}
