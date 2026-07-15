"use client";

import { useState } from "react";
import { useNotificacoesStore } from "@/store/useNotificacoesStore";
import { ColunaKanban } from "./ColunaKanban";
import { FormularioTarefa, type DadosTarefa } from "./FormularioTarefa";
import {
  COLUNAS,
  EQUIPE,
  membroPorId,
  type ColunaId,
  type Tarefa,
} from "./tipos";

type EstadoQuadro = Record<ColunaId, Tarefa[]>;

const TAREFAS_INICIAIS: EstadoQuadro = {
  afazer: [
    {
      id: "t1",
      titulo: "Escrever testes do módulo de jornada",
      descricao: "Cobrir cálculo de banco de horas e limites de jornada.",
      prioridade: "alta",
      responsavel: EQUIPE[1],
    },
    {
      id: "t2",
      titulo: "Responder e-mail da Ana (RH)",
      prioridade: "media",
      responsavel: EQUIPE[2],
    },
    {
      id: "t3",
      titulo: "Atualizar documentação da API",
      descricao: "Revisar exemplos de request e novos endpoints.",
      prioridade: "baixa",
      responsavel: EQUIPE[4],
    },
  ],
  fazendo: [
    {
      id: "t4",
      titulo: "Revisar PR do time",
      descricao: "Fila de 3 PRs aguardando revisão de código.",
      prioridade: "alta",
      responsavel: EQUIPE[0],
    },
    {
      id: "t5",
      titulo: "Reunião de sprint às 14h",
      prioridade: "media",
      responsavel: EQUIPE[3],
    },
  ],
  feito: [
    {
      id: "t6",
      titulo: "Deploy na Vercel",
      prioridade: "alta",
      responsavel: EQUIPE[1],
    },
    {
      id: "t7",
      titulo: "Daily do time às 9h",
      responsavel: EQUIPE[0],
      prioridade: "baixa",
    },
    {
      id: "t8",
      titulo: "Alongar às 15h 😌",
      responsavel: EQUIPE[5],
    },
  ],
};

let contador = 100;
function novoId(): string {
  contador += 1;
  return `t${contador}`;
}

/** Descreve o alvo do formulário: nova tarefa numa coluna ou edição de uma existente. */
type AlvoForm =
  | { modo: "criar"; coluna: ColunaId }
  | { modo: "editar"; coluna: ColunaId; tarefa: Tarefa }
  | null;

export function QuadroKanban() {
  const [quadro, setQuadro] = useState<EstadoQuadro>(TAREFAS_INICIAIS);
  const [idArrastando, setIdArrastando] = useState<string | null>(null);
  const [origem, setOrigem] = useState<ColunaId | null>(null);
  const [colunaAlvo, setColunaAlvo] = useState<ColunaId | null>(null);
  const [alvoForm, setAlvoForm] = useState<AlvoForm>(null);

  const notificar = useNotificacoesStore((s) => s.adicionar);

  function tituloColuna(id: ColunaId): string {
    return COLUNAS.find((c) => c.id === id)?.titulo ?? "";
  }

  /* --------------------------- Salvar (criar/editar) --------------------------- */

  function salvar(dados: DadosTarefa) {
    if (!alvoForm) return;
    const responsavel = membroPorId(dados.responsavelId);

    if (alvoForm.modo === "criar") {
      const nova: Tarefa = {
        id: novoId(),
        titulo: dados.titulo,
        descricao: dados.descricao || undefined,
        prioridade: dados.prioridade,
        responsavel,
      };
      const coluna = alvoForm.coluna;
      setQuadro((atual) => ({
        ...atual,
        [coluna]: [...atual[coluna], nova],
      }));
      // Notifica o gestor: tarefa criada
      notificar({
        tipo: "info",
        titulo: "Nova tarefa no quadro",
        descricao: `“${nova.titulo}” atribuída a ${responsavel.nome}.`,
        tempo: "agora",
      });
      // Se já entrou direto em "Feito", avisa a conclusão também
      if (coluna === "feito") {
        notificar({
          tipo: "sucesso",
          titulo: "Tarefa concluída ✅",
          descricao: `${responsavel.nome} concluiu “${nova.titulo}”.`,
          tempo: "agora",
        });
      }
    } else {
      const { coluna, tarefa } = alvoForm;
      setQuadro((atual) => ({
        ...atual,
        [coluna]: atual[coluna].map((t) =>
          t.id === tarefa.id
            ? {
                ...t,
                titulo: dados.titulo,
                descricao: dados.descricao || undefined,
                prioridade: dados.prioridade,
                responsavel,
              }
            : t
        ),
      }));
    }
    setAlvoForm(null);
  }

  function remover(colunaId: ColunaId, id: string) {
    setQuadro((atual) => ({
      ...atual,
      [colunaId]: atual[colunaId].filter((t) => t.id !== id),
    }));
  }

  /* --------------------------- Drag & drop --------------------------- */

  function soltarEm(destino: ColunaId) {
    if (!idArrastando || !origem || origem === destino) {
      limparArraste();
      return;
    }
    const tarefa = quadro[origem].find((t) => t.id === idArrastando);
    setQuadro((atual) => {
      const t = atual[origem].find((x) => x.id === idArrastando);
      if (!t) return atual;
      return {
        ...atual,
        [origem]: atual[origem].filter((x) => x.id !== idArrastando),
        [destino]: [...atual[destino], t],
      };
    });

    // Notifica o gestor: movimentação de coluna
    if (tarefa) {
      if (destino === "feito") {
        notificar({
          tipo: "sucesso",
          titulo: "Tarefa concluída ✅",
          descricao: `${tarefa.responsavel.nome} concluiu “${tarefa.titulo}”.`,
          tempo: "agora",
        });
      } else {
        notificar({
          tipo: "info",
          titulo: "Tarefa movida",
          descricao: `“${tarefa.titulo}” foi para ${tituloColuna(destino)}.`,
          tempo: "agora",
        });
      }
    }

    limparArraste();
  }

  function limparArraste() {
    setIdArrastando(null);
    setOrigem(null);
    setColunaAlvo(null);
  }

  function iniciarArraste(colunaId: ColunaId, id: string) {
    setIdArrastando(id);
    setOrigem(colunaId);
  }

  /* --------------------------- Abrir formulário --------------------------- */

  function abrirEditar(colunaId: ColunaId, id: string) {
    const tarefa = quadro[colunaId].find((t) => t.id === id);
    if (tarefa) setAlvoForm({ modo: "editar", coluna: colunaId, tarefa });
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUNAS.map((coluna) => (
          <ColunaKanban
            key={coluna.id}
            coluna={coluna}
            tarefas={quadro[coluna.id]}
            idArrastando={idArrastando}
            arrastandoSobre={colunaAlvo === coluna.id && origem !== coluna.id}
            onDragStartCartao={(id) => iniciarArraste(coluna.id, id)}
            onDragEndCartao={limparArraste}
            onDragOverColuna={() => setColunaAlvo(coluna.id)}
            onDragLeaveColuna={() =>
              setColunaAlvo((atual) => (atual === coluna.id ? null : atual))
            }
            onDropColuna={() => soltarEm(coluna.id)}
            onAbrirCriar={() =>
              setAlvoForm({ modo: "criar", coluna: coluna.id })
            }
            onEditar={(id) => abrirEditar(coluna.id, id)}
            onRemover={(id) => remover(coluna.id, id)}
          />
        ))}
      </div>

      {alvoForm && (
        <FormularioTarefa
          modo={alvoForm.modo}
          tarefa={alvoForm.modo === "editar" ? alvoForm.tarefa : undefined}
          nomeColuna={tituloColuna(alvoForm.coluna)}
          onSalvar={salvar}
          onFechar={() => setAlvoForm(null)}
        />
      )}
    </>
  );
}
