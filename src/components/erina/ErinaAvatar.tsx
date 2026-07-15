"use client";

export function ErinaAvatar({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Erina, assistente de IA"
    >
      {/* fundo circular */}
      <circle cx="32" cy="32" r="32" fill="#EEF2FF" />
      {/* antena */}
      <line x1="32" y1="10" x2="32" y2="16" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="9" r="3" fill="#6366F1" />
      {/* cabeça / rosto do robozinho */}
      <rect x="16" y="16" width="32" height="28" rx="12" fill="#6366F1" />
      {/* visor */}
      <rect x="20" y="22" width="24" height="16" rx="8" fill="#312E81" />
      {/* olhos */}
      <circle cx="27" cy="30" r="3" fill="#A5B4FC" />
      <circle cx="37" cy="30" r="3" fill="#A5B4FC" />
      {/* brilho nos olhos */}
      <circle cx="28" cy="29" r="1" fill="#ffffff" />
      <circle cx="38" cy="29" r="1" fill="#ffffff" />
      {/* bochechas */}
      <circle cx="20" cy="34" r="2" fill="#818CF8" opacity="0.7" />
      <circle cx="44" cy="34" r="2" fill="#818CF8" opacity="0.7" />
      {/* orelhinhas */}
      <rect x="12" y="27" width="4" height="8" rx="2" fill="#4F46E5" />
      <rect x="48" y="27" width="4" height="8" rx="2" fill="#4F46E5" />
      {/* sorriso */}
      <path d="M28 42 Q32 46 36 42" stroke="#A5B4FC" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
