"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  useNotificacoesStore,
  type Notificacao,
} from "@/store/useNotificacoesStore";
import { visualDoTipo } from "@/components/notificacoes/tipoVisual";
import { cn } from "@/lib/utils";

/** Tempo (ms) que cada toast fica visível antes de sumir sozinho. */
const DURACAO_TOAST = 5000;
/** Duração da animação de saída (ms) — deve casar com a transição do card. */
const DURACAO_SAIDA = 250;

/** Um único cartão de toaster, com seu próprio auto-dismiss. */
function ToastCard({ toast }: { toast: Notificacao }) {
  const removerToast = useNotificacoesStore((s) => s.removerToast);
  const { Icone, cor, fundo, rotulo } = visualDoTipo(toast.tipo);

  // `montado` controla a animação de entrada; `saindo` a de saída.
  const [montado, setMontado] = useState(false);
  const [saindo, setSaindo] = useState(false);

  // Anima a entrada no próximo frame após montar.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMontado(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Auto-dismiss após ~5s.
  useEffect(() => {
    const timer = window.setTimeout(() => setSaindo(true), DURACAO_TOAST);
    return () => window.clearTimeout(timer);
  }, []);

  // Quando entra em "saindo", remove do store após a transição.
  useEffect(() => {
    if (!saindo) return;
    const timer = window.setTimeout(() => removerToast(toast.id), DURACAO_SAIDA);
    return () => window.clearTimeout(timer);
  }, [saindo, toast.id, removerToast]);

  function fechar() {
    setSaindo(true);
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto flex w-80 max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-border-soft bg-card p-3.5 shadow-xl",
        "transition-all duration-300 ease-out",
        montado && !saindo
          ? "translate-x-0 opacity-100"
          : "translate-x-6 opacity-0"
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          fundo
        )}
        aria-hidden="true"
      >
        <Icone className={cn("h-5 w-5", cor)} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold leading-snug text-ink">
          <span className="sr-only">{rotulo}: </span>
          {toast.titulo}
        </p>
        <p className="mt-0.5 text-xs leading-snug text-muted">
          {toast.descricao}
        </p>
      </div>

      <button
        type="button"
        onClick={fechar}
        aria-label="Fechar notificação"
        className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-primary-light hover:text-primary"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/**
 * Pilha de toasters no canto superior direito. Renderiza os `toasts` do store.
 * Deve ser montado uma única vez (fica dentro do Topbar, presente em todas as telas).
 */
export function NotificacoesToaster() {
  const toasts = useNotificacoesStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed right-4 top-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-3"
      aria-label="Notificações recentes"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
