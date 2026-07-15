"use client";

import { cn } from "@/lib/utils";

interface MascotePlantinhaProps {
  /** Estágio de crescimento 0..4 (0 = broto, 4 = florida). */
  estagio: number;
  size?: number;
  className?: string;
}

/**
 * Mascote da saúde: uma plantinha em vaso, desenhada 100% em SVG inline
 * (sem rede). Ela fica mais "cheia e feliz" conforme o estágio aumenta.
 */
export function MascotePlantinha({
  estagio,
  size = 200,
  className,
}: MascotePlantinhaProps) {
  const nivel = Math.min(4, Math.max(0, estagio));

  // Rostinho fica mais feliz conforme cresce.
  const sorriso =
    nivel >= 3
      ? "M27 41 Q34 49 41 41" // sorrisão
      : nivel >= 1
        ? "M28 42 Q34 46 40 42" // sorriso
        : "M29 43 Q34 45 39 43"; // sorriso tímido

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 68 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Plantinha do bem-estar, estágio ${nivel + 1} de 5`}
      className={className}
    >
      {/* halo suave */}
      <circle cx="34" cy="34" r="34" fill="#EEF2FF" />

      {/* ---- Caule ---- */}
      <path
        d="M34 52 L34 30"
        stroke="#16A34A"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* ---- Folhas laterais (aparecem a partir do estágio 1) ---- */}
      {nivel >= 1 && (
        <path d="M34 44 Q24 42 21 34 Q31 34 34 42 Z" fill="#22C55E" />
      )}
      {nivel >= 2 && (
        <path
          d="M34 40 Q44 38 47 30 Q37 30 34 38 Z"
          fill="#22C55E"
        />
      )}

      {/* ---- Botão / flor no topo ---- */}
      {nivel < 3 ? (
        // broto fechado
        <circle cx="34" cy="28" r={5 + nivel} fill="#4ADE80" />
      ) : (
        // flor aberta com pétalas
        <g>
          <circle cx="34" cy="26" r="5.5" fill="#A5B4FC" />
          <circle cx="27" cy="26" r="5.5" fill="#C7D2FE" />
          <circle cx="41" cy="26" r="5.5" fill="#C7D2FE" />
          <circle cx="34" cy="19" r="5.5" fill="#C7D2FE" />
          <circle cx="34" cy="33" r="5.5" fill="#C7D2FE" />
          {/* miolo com carinha */}
          <circle cx="34" cy="26" r="6.5" fill="#FBBF24" />
        </g>
      )}

      {/* ---- Carinha (no botão ou no miolo da flor) ---- */}
      <g transform={nivel < 3 ? "translate(0 0)" : "translate(0 0)"}>
        {/* olhos */}
        <circle cx="31" cy={nivel < 3 ? "27" : "25"} r="1.4" fill="#1F2937" />
        <circle cx="37" cy={nivel < 3 ? "27" : "25"} r="1.4" fill="#1F2937" />
        {/* sorriso — só quando já brotou o suficiente */}
        {nivel >= 3 ? (
          <path
            d="M31 29 Q34 32 37 29"
            stroke="#1F2937"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <path
            d={sorriso}
            stroke="#166534"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
            transform="translate(0 -14)"
          />
        )}
      </g>

      {/* ---- Brilhos / faíscas de felicidade (estágio 4) ---- */}
      {nivel >= 4 && (
        <g className="animate-pulse">
          <path
            d="M52 16 l1.2 2.6 2.6 1.2 -2.6 1.2 -1.2 2.6 -1.2 -2.6 -2.6 -1.2 2.6 -1.2 Z"
            fill="#FBBF24"
          />
          <path
            d="M14 20 l0.9 2 2 0.9 -2 0.9 -0.9 2 -0.9 -2 -2 -0.9 2 -0.9 Z"
            fill="#818CF8"
          />
        </g>
      )}

      {/* ---- Vaso ---- */}
      <path
        d="M23 52 L45 52 L42 63 Q42 64 41 64 L27 64 Q26 64 26 63 Z"
        fill="#6366F1"
      />
      <rect x="21" y="49" width="26" height="5" rx="2.5" fill="#4F46E5" />
      {/* brilho no vaso */}
      <path
        d="M28 55 L27 62"
        stroke="#A5B4FC"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
