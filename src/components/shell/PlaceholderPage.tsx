import type { ReactNode } from "react";

export function PlaceholderPage({
  titulo,
  subtitulo,
  icone,
}: {
  titulo: string;
  subtitulo: string;
  icone: ReactNode;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-border-soft bg-card p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary">
          {icone}
        </div>
        <h1 className="mt-5 text-xl font-bold text-ink">{titulo}</h1>
        <p className="mt-2 text-sm text-muted">{subtitulo}</p>
        <span className="mt-5 inline-block rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
          Em breve
        </span>
      </div>
    </div>
  );
}
