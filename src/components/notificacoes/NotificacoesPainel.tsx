"use client";

import Link from "next/link";
import { CheckCheck, Sparkles } from "lucide-react";
import {
  useNotificacoesStore,
  type Notificacao,
} from "@/store/useNotificacoesStore";
import { visualDoTipo } from "@/components/notificacoes/tipoVisual";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Exemplos rotativos p/ o botão "Simular notificação"                 */
/* ------------------------------------------------------------------ */

const EXEMPLOS: Array<Omit<Notificacao, "id" | "lida">> = [
  {
    titulo: "Hora de respirar 🌿",
    descricao: "Um minutinho de pausa faz bem. Feche os olhos e relaxe.",
    tipo: "info",
    tempo: "agora",
  },
  {
    titulo: "Meta diária batida! 🎉",
    descricao: "Você concluiu todas as tarefas planejadas para hoje.",
    tipo: "sucesso",
    tempo: "agora",
  },
  {
    titulo: "Atenção: hora extra",
    descricao: "Você já passou da jornada prevista. Considere encerrar.",
    tipo: "alerta",
    tempo: "agora",
  },
  {
    titulo: "Falha ao sincronizar",
    descricao: "Não consegui salvar o ponto agora. Vou tentar de novo.",
    tipo: "erro",
    tempo: "agora",
  },
];

let proximoExemplo = 0;

/* ------------------------------------------------------------------ */
/* Item da lista                                                       */
/* ------------------------------------------------------------------ */

function ItemNotificacao({ n }: { n: Notificacao }) {
  const marcarLida = useNotificacoesStore((s) => s.marcarLida);
  const { Icone, cor, fundo, rotulo } = visualDoTipo(n.tipo);

  return (
    <button
      type="button"
      onClick={() => marcarLida(n.id)}
      className={cn(
        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-primary-light/60",
        !n.lida && "bg-primary-light"
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
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold text-ink">
            <span className="sr-only">{rotulo}: </span>
            {n.titulo}
          </p>
          {!n.lida && (
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-primary"
              aria-label="Não lida"
            />
          )}
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted">
          {n.descricao}
        </p>
        <p className="mt-1 text-[11px] font-medium text-muted">{n.tempo}</p>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Painel                                                              */
/* ------------------------------------------------------------------ */

/**
 * Conteúdo do dropdown do sino. Ancoragem (absolute/position) e fechar-ao-clicar-fora
 * ficam a cargo do Topbar, que envolve este painel.
 */
export function NotificacoesPainel() {
  const notificacoes = useNotificacoesStore((s) => s.notificacoes);
  const marcarTodasLidas = useNotificacoesStore((s) => s.marcarTodasLidas);
  const adicionar = useNotificacoesStore((s) => s.adicionar);

  function simular() {
    const exemplo = EXEMPLOS[proximoExemplo % EXEMPLOS.length];
    proximoExemplo += 1;
    adicionar(exemplo);
  }

  return (
    <div
      role="dialog"
      aria-label="Notificações"
      className="flex max-h-[min(32rem,80vh)] w-[22rem] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-xl border border-border-soft bg-card shadow-xl"
    >
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-2 border-b border-border-soft px-4 py-3">
        <h2 className="text-sm font-bold text-ink">Notificações</h2>
        <button
          type="button"
          onClick={marcarTodasLidas}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary-light"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Marcar todas como lidas
        </button>
      </div>

      {/* Lista */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {notificacoes.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted">
            Nenhuma notificação por aqui. ✨
          </p>
        ) : (
          <ul className="divide-y divide-border-soft">
            {notificacoes.map((n) => (
              <li key={n.id}>
                <ItemNotificacao n={n} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Rodapé */}
      <div className="flex items-center justify-between gap-2 border-t border-border-soft px-4 py-2.5">
        <button
          type="button"
          onClick={simular}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted transition-colors hover:bg-primary-light hover:text-primary"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Simular notificação
        </button>
        <Link
          href="/alertas"
          className="rounded-md px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary-light"
        >
          Ver todas
        </Link>
      </div>
    </div>
  );
}
