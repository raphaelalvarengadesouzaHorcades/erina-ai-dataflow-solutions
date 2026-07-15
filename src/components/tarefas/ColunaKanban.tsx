"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CartaoTarefa } from "./CartaoTarefa";
import { COLUNAS, type Tarefa } from "./tipos";

interface ColunaKanbanProps {
  coluna: (typeof COLUNAS)[number];
  tarefas: Tarefa[];
  idArrastando: string | null;
  arrastandoSobre: boolean;
  onDragStartCartao: (id: string) => void;
  onDragEndCartao: () => void;
  onDragOverColuna: () => void;
  onDragLeaveColuna: () => void;
  onDropColuna: () => void;
  onAbrirCriar: () => void;
  onEditar: (id: string) => void;
  onRemover: (id: string) => void;
}

export function ColunaKanban({
  coluna,
  tarefas,
  idArrastando,
  arrastandoSobre,
  onDragStartCartao,
  onDragEndCartao,
  onDragOverColuna,
  onDragLeaveColuna,
  onDropColuna,
  onAbrirCriar,
  onEditar,
  onRemover,
}: ColunaKanbanProps) {
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        onDragOverColuna();
      }}
      onDragLeave={onDragLeaveColuna}
      onDrop={(e) => {
        e.preventDefault();
        onDropColuna();
      }}
      className={cn(
        "flex min-h-[24rem] flex-col rounded-2xl border border-border-soft bg-page/40 p-3",
        "transition-colors",
        arrastandoSobre && "border-primary/60 bg-primary-light/60"
      )}
    >
      {/* Cabeçalho da coluna */}
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className={cn("h-2.5 w-2.5 rounded-full", coluna.acento)} />
        <h2 className="text-sm font-semibold text-ink">{coluna.titulo}</h2>
        <span className="ml-auto rounded-full bg-card px-2 py-0.5 text-xs font-semibold text-muted">
          {tarefas.length}
        </span>
      </div>

      {/* Lista de cartões */}
      <div className="flex flex-1 flex-col gap-2">
        {tarefas.map((tarefa) => (
          <CartaoTarefa
            key={tarefa.id}
            tarefa={tarefa}
            arrastando={idArrastando === tarefa.id}
            onDragStart={() => onDragStartCartao(tarefa.id)}
            onDragEnd={onDragEndCartao}
            onEditar={() => onEditar(tarefa.id)}
            onRemover={() => onRemover(tarefa.id)}
          />
        ))}

        {tarefas.length === 0 && (
          <p className="rounded-xl border border-dashed border-border-soft px-3 py-6 text-center text-xs text-muted">
            Nenhuma tarefa por aqui
          </p>
        )}
      </div>

      {/* Adicionar tarefa */}
      <button
        type="button"
        onClick={onAbrirCriar}
        className={cn(
          "mt-2 flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted",
          "transition-colors hover:bg-card hover:text-ink"
        )}
      >
        <Plus className="h-4 w-4" strokeWidth={2.4} />
        Adicionar
      </button>
    </div>
  );
}
