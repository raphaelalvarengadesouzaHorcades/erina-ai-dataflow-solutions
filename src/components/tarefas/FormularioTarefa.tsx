"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AvatarMembro } from "./AvatarMembro";
import {
  EQUIPE,
  PRIORIDADES,
  type Prioridade,
  type Tarefa,
} from "./tipos";

export interface DadosTarefa {
  titulo: string;
  descricao: string;
  prioridade: Prioridade;
  responsavelId: string;
}

interface FormularioTarefaProps {
  /** "criar" mostra título de nova tarefa; "editar" pré-preenche. */
  modo: "criar" | "editar";
  /** tarefa existente (no modo editar) ou defaults (no modo criar) */
  tarefa?: Tarefa;
  nomeColuna: string;
  onSalvar: (dados: DadosTarefa) => void;
  onFechar: () => void;
}

const ORDEM_PRIORIDADE: Prioridade[] = ["alta", "media", "baixa"];

export function FormularioTarefa({
  modo,
  tarefa,
  nomeColuna,
  onSalvar,
  onFechar,
}: FormularioTarefaProps) {
  const [titulo, setTitulo] = useState(tarefa?.titulo ?? "");
  const [descricao, setDescricao] = useState(tarefa?.descricao ?? "");
  const [prioridade, setPrioridade] = useState<Prioridade>(
    tarefa?.prioridade ?? "media"
  );
  const [responsavelId, setResponsavelId] = useState(
    tarefa?.responsavel.id ?? EQUIPE[0].id
  );

  // Fecha com Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onFechar();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onFechar]);

  function confirmar() {
    const limpo = titulo.trim();
    if (!limpo) return;
    onSalvar({
      titulo: limpo,
      descricao: descricao.trim(),
      prioridade,
      responsavelId,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={modo === "criar" ? "Nova tarefa" : "Editar tarefa"}
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="Fechar"
        onClick={onFechar}
        className="absolute inset-0 cursor-default bg-ink/40 backdrop-blur-sm"
      />

      {/* painel */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border-soft bg-card p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-ink">
              {modo === "criar" ? "Nova tarefa" : "Editar tarefa"}
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              Coluna <span className="font-semibold text-ink">{nomeColuna}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-page hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={2.4} />
          </button>
        </div>

        {/* Título */}
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-muted">
            Título
          </span>
          <input
            autoFocus
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                confirmar();
              }
            }}
            placeholder="O que precisa ser feito?"
            className={cn(
              "w-full rounded-lg border border-border-soft bg-page/50 px-3 py-2 text-sm text-ink outline-none",
              "placeholder:text-muted focus:border-primary/60 focus:bg-card"
            )}
          />
        </label>

        {/* Descrição */}
        <label className="mt-3 block">
          <span className="mb-1 block text-xs font-semibold text-muted">
            Descrição{" "}
            <span className="font-normal text-muted/70">(opcional)</span>
          </span>
          <textarea
            rows={3}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Detalhe rápido para o time entender o contexto..."
            className={cn(
              "w-full resize-none rounded-lg border border-border-soft bg-page/50 px-3 py-2 text-sm text-ink outline-none",
              "placeholder:text-muted focus:border-primary/60 focus:bg-card"
            )}
          />
        </label>

        {/* Prioridade */}
        <div className="mt-3">
          <span className="mb-1.5 block text-xs font-semibold text-muted">
            Prioridade
          </span>
          <div className="flex gap-2">
            {ORDEM_PRIORIDADE.map((p) => {
              const ativa = prioridade === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPrioridade(p)}
                  aria-pressed={ativa}
                  className={cn(
                    "flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all",
                    ativa
                      ? cn(PRIORIDADES[p].classe, "ring-2 ring-primary/40")
                      : "bg-page/60 text-muted hover:bg-page hover:text-ink"
                  )}
                >
                  {PRIORIDADES[p].rotulo}
                </button>
              );
            })}
          </div>
        </div>

        {/* Responsável */}
        <div className="mt-3">
          <span className="mb-1.5 block text-xs font-semibold text-muted">
            Responsável
          </span>
          <div className="grid grid-cols-2 gap-2">
            {EQUIPE.map((membro) => {
              const ativo = responsavelId === membro.id;
              return (
                <button
                  key={membro.id}
                  type="button"
                  onClick={() => setResponsavelId(membro.id)}
                  aria-pressed={ativo}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-all",
                    ativo
                      ? "border-primary/60 bg-primary-light"
                      : "border-border-soft bg-page/40 hover:border-primary/30 hover:bg-page"
                  )}
                >
                  <AvatarMembro membro={membro} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-ink">
                      {membro.nome}
                    </span>
                    <span className="block truncate text-[0.65rem] text-muted">
                      {membro.cargo}
                    </span>
                  </span>
                  {ativo && (
                    <Check
                      className="h-4 w-4 shrink-0 text-primary"
                      strokeWidth={2.6}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ações */}
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onFechar}
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-page hover:text-ink"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirmar}
            disabled={!titulo.trim()}
            className={cn(
              "flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors",
              "hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <Check className="h-4 w-4" strokeWidth={2.6} />
            {modo === "criar" ? "Adicionar tarefa" : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}
