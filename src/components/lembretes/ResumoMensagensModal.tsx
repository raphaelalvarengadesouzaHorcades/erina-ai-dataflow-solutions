"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Mail, MessageCircle, X, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { EMAILS, CONVERSAS } from "@/components/mensagens/data";

type Canal = "email" | "whatsapp";

interface MensagemPerdida {
  id: string;
  canal: Canal;
  remetente: string;
  previa: string;
  horario: string;
  importante?: boolean;
}

// Derivado da MESMA caixa de entrada (/mensagens): os pop-ups mostram os
// e-mails e conversas reais (mesmos remetentes/assuntos), para ficar coerente.
const MENSAGENS: MensagemPerdida[] = [
  ...EMAILS.slice(0, 3).map((e, i) => ({
    id: e.id,
    canal: "email" as const,
    remetente: e.remetente,
    previa: e.assunto,
    horario: e.horario,
    importante: i === 0 && e.naoLido,
  })),
  ...CONVERSAS.filter((c) => c.naoLidas > 0)
    .slice(0, 3)
    .map((c) => ({
      id: c.id,
      canal: "whatsapp" as const,
      remetente: c.nome,
      previa: c.ultimaMsg,
      horario: c.horario,
    })),
];

const CANAL_CONFIG: Record<
  Canal,
  { icone: LucideIcon; label: string; iconClassName: string }
> = {
  email: {
    icone: Mail,
    label: "E-mail",
    iconClassName: "bg-primary-light text-primary",
  },
  whatsapp: {
    icone: MessageCircle,
    label: "WhatsApp",
    iconClassName: "bg-success-light text-success",
  },
};

interface ResumoMensagensModalProps {
  aberto: boolean;
  aoFechar: () => void;
}

export default function ResumoMensagensModal({
  aberto,
  aoFechar,
}: ResumoMensagensModalProps) {
  useEffect(() => {
    if (!aberto) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") aoFechar();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [aberto, aoFechar]);

  if (!aberto) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resumo-titulo"
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Fechar resumo"
        onClick={aoFechar}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Painel */}
      <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-card shadow-2xl sm:rounded-2xl">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4 border-b border-border-soft px-6 pt-6 pb-4">
          <div>
            <h2 id="resumo-titulo" className="text-xl font-bold text-ink">
              Resumo da sua pausa
            </h2>
            <p className="mt-0.5 text-sm text-muted">
              Você ficou ausente por 52 min
            </p>
          </div>
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar"
            className="-mr-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-page hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={2.2} />
          </button>
        </div>

        {/* Conteúdo rolável */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {/* Fala da Erina */}
          <div className="flex items-start gap-3 rounded-2xl bg-primary-light p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
              <Sparkles className="h-4.5 w-4.5" strokeWidth={2.2} />
            </span>
            <p className="text-sm leading-relaxed text-ink">
              Nada urgente por aqui, pode respirar 💛. Te separei o que chegou:
            </p>
          </div>

          {/* Lista de mensagens */}
          <ul className="space-y-2.5">
            {MENSAGENS.map((msg, i) => {
              const config = CANAL_CONFIG[msg.canal];
              const Icone = config.icone;
              return (
                <li key={i}>
                  <Link
                    href={`/mensagens?aba=${msg.canal}&id=${msg.id}`}
                    onClick={aoFechar}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-3.5 transition-colors",
                      msg.importante
                        ? "border-warning/40 bg-warning/[0.06] hover:bg-warning/[0.12]"
                        : "border-border-soft bg-page/40 hover:bg-page",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                        config.iconClassName,
                      )}
                    >
                      <Icone className="h-4.5 w-4.5" strokeWidth={2.2} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold text-ink">
                          {msg.remetente}
                        </p>
                        {msg.importante && (
                          <span className="shrink-0 rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-semibold text-warning">
                            Importante
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-sm text-muted">
                        {msg.previa}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs text-muted">
                      {msg.horario}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-end gap-3 border-t border-border-soft px-6 py-4">
          <button
            type="button"
            onClick={aoFechar}
            className="inline-flex items-center gap-2 rounded-xl border border-border-soft px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-page"
          >
            <Check className="h-4 w-4" strokeWidth={2.2} />
            Marcar tudo como lido
          </button>
          <button
            type="button"
            onClick={aoFechar}
            className="inline-flex items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
