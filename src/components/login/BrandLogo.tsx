import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Logo da marca ERINA.IA — coração moderno (duas metades entrelaçadas) com
 * gradiente violeta + wordmark. Usado na coluna de marca, no cabeçalho mobile
 * e no card flutuante sobre a foto.
 */
export function BrandLogo({
  className,
  markSize = 40,
  wordmarkClassName,
  showWordmark = true,
}: {
  className?: string;
  markSize?: number;
  wordmarkClassName?: string;
  showWordmark?: boolean;
}) {
  // id único e estável por instância (evita colisão de gradiente e hydration mismatch)
  const gid = `erina-heart-${useId().replace(/:/g, "")}`;

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className="inline-flex items-center justify-center rounded-2xl bg-white shadow-sm shadow-[#7B61FF]/20 ring-1 ring-[#7B61FF]/10"
        style={{ width: markSize + 16, height: markSize + 16 }}
      >
        <svg
          width={markSize}
          height={markSize}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <linearGradient id={gid} x1="6" y1="6" x2="42" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A78BFA" />
              <stop offset="0.55" stopColor="#7B61FF" />
              <stop offset="1" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          {/* metade direita (mais clara, "fita" sobreposta) */}
          <path
            d="M24 41.5C24 41.5 39.5 32.4 39.5 20.3C39.5 14.6 35.2 10.5 30.1 10.5C27.2 10.5 24.9 11.9 24 14.1L24 41.5Z"
            fill={`url(#${gid})`}
            opacity="0.55"
          />
          {/* metade esquerda (traço principal do coração) */}
          <path
            d="M24 41.5C24 41.5 8.5 32.4 8.5 20.3C8.5 14.6 12.8 10.5 17.9 10.5C20.8 10.5 23.1 11.9 24 14.1C24.9 11.9 27.2 10.5 30.1 10.5C35.2 10.5 39.5 14.6 39.5 20.3"
            stroke={`url(#${gid})`}
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>
      {showWordmark && (
        <span
          className={cn(
            "text-xl font-bold leading-none tracking-tight text-[#1E1B4B]",
            wordmarkClassName
          )}
        >
          ERINA<span className="font-normal text-[#A78BFA]">.IA</span>
        </span>
      )}
    </span>
  );
}
