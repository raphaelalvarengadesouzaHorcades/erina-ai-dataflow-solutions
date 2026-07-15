"use client";

import { GripVertical, Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AvatarMembro } from "./AvatarMembro";
import { PRIORIDADES, type Tarefa } from "./tipos";

interface CartaoTarefaProps {
  tarefa: Tarefa;
  arrastando: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onEditar: () => void;
  onRemover: () => void;
}

export function CartaoTarefa({
  tarefa,
  arrastando,
  onDragStart,
  onDragEnd,
  onEditar,
  onRemover,
}: CartaoTarefaProps) {
  const prioridade = tarefa.prioridade ? PRIORIDADES[tarefa.prioridade] : null;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDoubleClick={onEditar}
      className={cn(
        "group relative cursor-grab rounded-xl border border-border-soft bg-card p-3 shadow-sm",
        "transition-all hover:border-primary/40 hover:shadow-md active:cursor-grabbing",
        arrastando && "opacity-50 ring-2 ring-primary"
      )}
    >
      <div className="flex items-start gap-2">
        <GripVertical
          className="mt-0.5 h-4 w-4 shrink-0 text-muted/60"
          strokeWidth={2}
          aria-hidden
        />
        <p className="flex-1 pr-10 text-sm font-medium leading-snug text-ink">
          {tarefa.titulo}
        </p>
      </div>

      {tarefa.descricao && (
        <p className="mt-1.5 ml-6 line-clamp-2 text-xs leading-snug text-muted">
          {tarefa.descricao}
        </p>
      )}

      <div className="mt-2.5 ml-6 flex items-center justify-between gap-2">
        {prioridade ? (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
              prioridade.classe
            )}
          >
            {prioridade.rotulo}
          </span>
        ) : (
          <span />
        )}

        <span className="flex items-center gap-1.5">
          <span className="hidden text-[0.65rem] font-medium text-muted sm:inline">
            {tarefa.responsavel.nome.split(" ")[0]}
          </span>
          <AvatarMembro membro={tarefa.responsavel} />
        </span>
      </div>

      {/* Ações no hover */}
      <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 transition-all group-hover:opacity-100 group-focus-within:opacity-100">
        <button
          type="button"
          onClick={onEditar}
          aria-label={`Editar tarefa "${tarefa.titulo}"`}
          className="rounded-md p-1 text-muted transition-colors hover:bg-primary-light hover:text-primary focus-visible:opacity-100"
        >
          <Pencil className="h-3.5 w-3.5" strokeWidth={2.2} />
        </button>
        <button
          type="button"
          onClick={onRemover}
          aria-label={`Remover tarefa "${tarefa.titulo}"`}
          className="rounded-md p-1 text-muted transition-colors hover:bg-danger-light hover:text-danger focus-visible:opacity-100"
        >
          <X className="h-4 w-4" strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
