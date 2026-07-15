import { cn } from "@/lib/utils";
import type { Membro } from "./tipos";

interface AvatarMembroProps {
  membro: Membro;
  tamanho?: "sm" | "md";
  className?: string;
}

/** Avatar circular com as iniciais do membro (somente tokens semânticos). */
export function AvatarMembro({
  membro,
  tamanho = "sm",
  className,
}: AvatarMembroProps) {
  return (
    <span
      title={`${membro.nome} · ${membro.cargo}`}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
        "ring-2 ring-card",
        tamanho === "sm" ? "h-6 w-6 text-[0.625rem]" : "h-8 w-8 text-xs",
        membro.cor,
        className
      )}
    >
      {membro.iniciais}
    </span>
  );
}
