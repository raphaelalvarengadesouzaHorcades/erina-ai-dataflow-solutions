"use client";

import { useMemo, useState } from "react";
import { GradeMes } from "@/components/calendario/GradeMes";
import { PainelDia } from "@/components/calendario/PainelDia";
import {
  chaveData,
  eventosIniciais,
  novoId,
  ORDEM_TIPOS,
  TIPOS,
  type Evento,
  type TipoEvento,
} from "@/components/calendario/eventos";

export default function CalendarioPage() {
  // Data de referência fixa por render (evita divergência de fuso/rerender).
  const [hoje] = useState(() => {
    const agora = new Date();
    return new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  });

  const [eventos, setEventos] = useState<Evento[]>(() => eventosIniciais(hoje));
  const [diaSelecionado, setDiaSelecionado] = useState<Date>(hoje);
  const [mesVisivel, setMesVisivel] = useState<Date>(
    () => new Date(hoje.getFullYear(), hoje.getMonth(), 1),
  );

  // Índice de eventos por dia para a grade.
  const eventosPorDia = useMemo(() => {
    const mapa = new Map<string, Evento[]>();
    for (const ev of eventos) {
      const lista = mapa.get(ev.data);
      if (lista) lista.push(ev);
      else mapa.set(ev.data, [ev]);
    }
    return mapa;
  }, [eventos]);

  const eventosDoDia = eventosPorDia.get(chaveData(diaSelecionado)) ?? [];

  function selecionar(data: Date) {
    setDiaSelecionado(data);
    if (
      data.getFullYear() !== mesVisivel.getFullYear() ||
      data.getMonth() !== mesVisivel.getMonth()
    ) {
      setMesVisivel(new Date(data.getFullYear(), data.getMonth(), 1));
    }
  }

  function navegarMes(delta: number) {
    setMesVisivel((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  }

  function irParaHoje() {
    setMesVisivel(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
    setDiaSelecionado(hoje);
  }

  function adicionar(dados: { titulo: string; horario: string; tipo: TipoEvento }) {
    const novo: Evento = {
      id: novoId(),
      data: chaveData(diaSelecionado),
      horario: dados.horario,
      titulo: dados.titulo,
      tipo: dados.tipo,
    };
    setEventos((atual) => [...atual, novo]);
  }

  function remover(id: string) {
    setEventos((atual) => atual.filter((ev) => ev.id !== id));
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-ink">Calendário</h1>
        <p className="mt-1 text-muted">Marque e organize o seu dia</p>
      </header>

      {/* Legenda de tipos */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {ORDEM_TIPOS.map((t) => (
          <span key={t} className="flex items-center gap-2 text-sm text-muted">
            <span className={`h-2.5 w-2.5 rounded-full ${TIPOS[t].ponto}`} />
            {TIPOS[t].rotulo}
          </span>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <GradeMes
          mesVisivel={mesVisivel}
          hoje={hoje}
          diaSelecionado={diaSelecionado}
          eventosPorDia={eventosPorDia}
          onSelecionar={selecionar}
          onNavegar={navegarMes}
          onHoje={irParaHoje}
        />

        <PainelDia
          data={diaSelecionado}
          hoje={hoje}
          eventos={eventosDoDia}
          onAdicionar={adicionar}
          onRemover={remover}
        />
      </div>
    </div>
  );
}
