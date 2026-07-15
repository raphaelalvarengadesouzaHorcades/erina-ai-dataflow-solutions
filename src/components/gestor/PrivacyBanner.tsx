"use client";

import { ShieldCheck, EyeOff } from "lucide-react";

/**
 * Banner "privacy by design" do Painel do Gestor.
 * Deixa explícito que o gestor NÃO enxerga o dado individual de vigilância —
 * apenas horas/hora extra (finalidade legal e protetiva) e indicadores
 * agregados e anônimos da equipe. Gestão por cuidado, não por controle.
 */
export function PrivacyBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-primary/25 bg-primary-light p-6">
      {/* Selo decorativo ao fundo */}
      <ShieldCheck
        className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 text-primary/10"
        strokeWidth={1.5}
        aria-hidden
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
          <ShieldCheck className="h-6 w-6" strokeWidth={2.2} />
        </span>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-ink">
              Você não vê o dado individual de ninguém
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              <EyeOff className="h-3.5 w-3.5" strokeWidth={2.4} />
              Privacy by design
            </span>
          </div>

          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink/75">
            O gestor acompanha{" "}
            <strong className="font-semibold text-ink">horas e hora extra</strong>{" "}
            para proteger a equipe do excesso e cumprir a{" "}
            <strong className="font-semibold text-ink">CLT</strong> —{" "}
            <strong className="font-semibold text-ink">nunca</strong> telas,
            teclado ou conteúdo de mensagens. Fora isso, só indicadores{" "}
            <strong className="font-semibold text-ink">agregados e anônimos</strong>{" "}
            do time. É assim que se cuida das pessoas sem vigiá-las.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-2.5 rounded-xl border border-success/25 bg-success-light/50 px-3 py-2.5">
              <span className="mt-0.5 text-xs font-bold uppercase tracking-wide text-success-dark">
                O gestor vê
              </span>
              <span className="text-sm leading-snug text-ink/70">
                Horas e hora extra por pessoa (para cumprir a CLT e evitar
                burnout) e o bem-estar do time em números agregados.
              </span>
            </div>
            <div className="flex items-start gap-2.5 rounded-xl border border-danger/20 bg-danger-light/40 px-3 py-2.5">
              <span className="mt-0.5 text-xs font-bold uppercase tracking-wide text-danger">
                O gestor nunca vê
              </span>
              <span className="text-sm leading-snug text-ink/70">
                Sua tela, seu teclado ou o conteúdo das suas mensagens. Sem
                ranking, sem câmera escondida — cuidado, não controle.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
