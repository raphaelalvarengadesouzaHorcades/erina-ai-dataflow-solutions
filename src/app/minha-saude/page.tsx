"use client";

import { CartaoDestaque } from "@/components/gamificacao/CartaoDestaque";
import { CartaoMascote } from "@/components/gamificacao/CartaoMascote";
import { HabitosDeHoje } from "@/components/gamificacao/HabitosDeHoje";
import {
  SelosConquistados,
  SelosBloqueados,
} from "@/components/gamificacao/GridSelos";
import { MensagemReforco } from "@/components/gamificacao/MensagemReforco";

export default function MinhaSaudePage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho acolhedor */}
      <header>
        <h1 className="text-3xl font-bold text-ink">Sua saúde no trabalho</h1>
        <p className="mt-1 text-muted">
          Um espaço só seu para cuidar de você durante a jornada — no seu ritmo,
          sem cobrança e sem vigilância.
        </p>
      </header>

      {/* Topo: [Destaque + Suas conquistas] (2 col) + Plantinha (1 col) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <CartaoDestaque />
          {/* Selos conquistados preenchem o espaço abaixo do cartão de pontos */}
          <SelosConquistados />
        </div>
        <div className="lg:col-span-1">
          <CartaoMascote />
        </div>
      </div>

      {/* Hábitos de hoje — largura total */}
      <HabitosDeHoje />

      {/* Próximas conquistas (selos bloqueados) — mais abaixo */}
      <SelosBloqueados />

      {/* Reforço ético — largura total */}
      <MensagemReforco />
    </div>
  );
}
