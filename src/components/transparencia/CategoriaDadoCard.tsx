"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { CalendarClock, Eye, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

export type CategoriaDado = {
  id: string;
  nome: string;
  icone: LucideIcon;
  finalidade: string;
  baseLegal: string;
  retencao: string;
  acesso: string;
  /** Consentimento ligado por padrão? */
  padrao: boolean;
  /** Coleta é opcional (pode ser desligada)? Registro de jornada é obrigação legal. */
  opcional: boolean;
};

function LinhaInfo({
  icone: Icone,
  rotulo,
  valor,
}: {
  icone: LucideIcon;
  rotulo: string;
  valor: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icone className="mt-0.5 h-4 w-4 shrink-0 text-muted" strokeWidth={2} />
      <p className="text-sm leading-snug text-ink/80">
        <span className="font-medium text-ink">{rotulo}: </span>
        {valor}
      </p>
    </div>
  );
}

export function CategoriaDadoCard({ categoria }: { categoria: CategoriaDado }) {
  const [ativo, setAtivo] = useState(categoria.padrao);
  const Icone = categoria.icone;

  const obrigatorio = !categoria.opcional;
  const ligado = obrigatorio ? true : ativo;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
      {/* Cabeçalho do card */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
              ligado ? "bg-primary-light" : "bg-page",
            )}
          >
            <Icone
              className={cn(
                "h-5 w-5 transition-colors",
                ligado ? "text-primary" : "text-muted",
              )}
              strokeWidth={2.2}
            />
          </span>
          <div>
            <h3 className="font-bold leading-tight text-ink">
              {categoria.nome}
            </h3>
            <span
              className={cn(
                "mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                ligado
                  ? "bg-success-light text-success-dark"
                  : "bg-page text-muted",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  ligado ? "bg-success" : "bg-muted",
                )}
              />
              {ligado ? "Coleta ativada" : "Coleta desativada"}
            </span>
          </div>
        </div>

        {/* Toggle de consentimento (opt-in) */}
        {obrigatorio ? (
          <span className="shrink-0 rounded-lg bg-page px-2.5 py-1 text-xs font-medium text-muted">
            Obrigatório (CLT)
          </span>
        ) : (
          <button
            type="button"
            role="switch"
            aria-checked={ativo}
            aria-label={`Consentimento para ${categoria.nome}`}
            onClick={() => setAtivo((v) => !v)}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              ativo ? "bg-primary" : "bg-border-soft",
            )}
          >
            <span
              className={cn(
                "inline-block h-[1.125rem] w-[1.125rem] transform rounded-full bg-white shadow-sm transition-transform",
                ativo ? "translate-x-6" : "translate-x-1",
              )}
            />
          </button>
        )}
      </div>

      {/* Detalhes */}
      <div className="flex flex-col gap-2 border-t border-border-soft pt-4">
        <LinhaInfo icone={Eye} rotulo="Para quê" valor={categoria.finalidade} />
        <LinhaInfo icone={Scale} rotulo="Base legal" valor={categoria.baseLegal} />
        <LinhaInfo
          icone={CalendarClock}
          rotulo="Retenção"
          valor={categoria.retencao}
        />
        <LinhaInfo icone={Eye} rotulo="Quem acessa" valor={categoria.acesso} />
      </div>
    </div>
  );
}
