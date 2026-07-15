"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Download, ShieldOff, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Direito = {
  id: string;
  titulo: string;
  descricao: string;
  icone: LucideIcon;
  cta: string;
  /** Texto do modal explicando o que a ação faria. */
  detalhe: string;
  /** Mensagem de confirmação (toast). */
  toast: string;
  tom: "neutro" | "perigo";
};

const DIREITOS: Direito[] = [
  {
    id: "exportar",
    titulo: "Exportar meus dados",
    descricao: "Baixe tudo que a Erina guarda sobre você, em um arquivo legível.",
    icone: Download,
    cta: "Exportar",
    detalhe:
      "Geraríamos um arquivo (JSON + CSV) com todo o seu histórico de jornada, pausas e preferências. É o seu direito de portabilidade — Art. 18, V da LGPD.",
    toast: "Exportação simulada: seu pacote de dados estaria pronto para download.",
    tom: "neutro",
  },
  {
    id: "apagar",
    titulo: "Apagar meus dados",
    descricao: "Remova permanentemente as informações pessoais coletadas.",
    icone: Trash2,
    cta: "Apagar",
    detalhe:
      "Removeríamos seus dados pessoais dos nossos sistemas, respeitando apenas os registros de ponto que a lei obriga a guardar. É o direito de eliminação — Art. 18, VI da LGPD.",
    toast: "Ação simulada: nada foi apagado de verdade nesta demonstração.",
    tom: "perigo",
  },
  {
    id: "revogar",
    titulo: "Revogar todos os consentimentos",
    descricao: "Desligue de uma vez todas as coletas opcionais.",
    icone: ShieldOff,
    cta: "Revogar tudo",
    detalhe:
      "Desativaríamos imediatamente toda coleta que depende do seu consentimento. Você pode reativar quando quiser — revogar é tão fácil quanto consentir (Art. 8, §5 da LGPD).",
    toast: "Ação simulada: todos os consentimentos opcionais seriam revogados.",
    tom: "perigo",
  },
];

export function SeusDireitos() {
  const [aberto, setAberto] = useState<Direito | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function confirmar(direito: Direito) {
    setToast(direito.toast);
    setAberto(null);
    window.setTimeout(() => setToast(null), 4000);
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {DIREITOS.map((direito) => {
          const Icone = direito.icone;
          const perigo = direito.tom === "perigo";
          return (
            <div
              key={direito.id}
              className="flex flex-col gap-3 rounded-2xl border border-border-soft bg-card p-5 shadow-sm"
            >
              <span
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl",
                  perigo ? "bg-danger-light" : "bg-primary-light",
                )}
              >
                <Icone
                  className={cn(
                    "h-5 w-5",
                    perigo ? "text-danger" : "text-primary",
                  )}
                  strokeWidth={2.2}
                />
              </span>
              <div className="flex-1">
                <h3 className="font-bold text-ink">{direito.titulo}</h3>
                <p className="mt-1 text-sm leading-snug text-muted">
                  {direito.descricao}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAberto(direito)}
                className={cn(
                  "mt-auto rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                  perigo
                    ? "bg-danger-light text-danger hover:bg-danger hover:text-white"
                    : "bg-primary text-white hover:bg-primary-hover",
                )}
              >
                {direito.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal de confirmação (mock) */}
      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={aberto.titulo}
          onClick={() => setAberto(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl",
                    aberto.tom === "perigo"
                      ? "bg-danger-light"
                      : "bg-primary-light",
                  )}
                >
                  <aberto.icone
                    className={cn(
                      "h-5 w-5",
                      aberto.tom === "perigo" ? "text-danger" : "text-primary",
                    )}
                    strokeWidth={2.2}
                  />
                </span>
                <h3 className="text-lg font-bold text-ink">{aberto.titulo}</h3>
              </div>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setAberto(null)}
                className="rounded-lg p-1 text-muted transition-colors hover:bg-page hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm leading-relaxed text-ink/80">
              {aberto.detalhe}
            </p>

            <p className="mt-3 rounded-xl bg-page px-3 py-2 text-xs font-medium text-muted">
              Demonstração: nenhum dado real será alterado ao confirmar.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAberto(null)}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:bg-page"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => confirmar(aberto)}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors",
                  aberto.tom === "perigo"
                    ? "bg-danger hover:bg-danger/90"
                    : "bg-primary hover:bg-primary-hover",
                )}
              >
                Entendi, continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast (mock) */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 flex max-w-md -translate-x-1/2 items-start gap-3 rounded-2xl bg-ink px-5 py-4 text-white shadow-lg">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" strokeWidth={2.2} />
          <p className="text-sm leading-snug">{toast}</p>
          <button
            type="button"
            aria-label="Fechar aviso"
            onClick={() => setToast(null)}
            className="ml-1 shrink-0 text-white/60 transition-colors hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
}
