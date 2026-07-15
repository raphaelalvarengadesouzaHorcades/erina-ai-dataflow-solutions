"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Paleta (espelha as CSS vars do design system)                       */
/* ------------------------------------------------------------------ */
const COR = {
  primary: "#6366f1",
  primaryLight: "#c7d2fe",
  success: "#22c55e",
  warning: "#f97316",
  danger: "#ef4444",
  muted: "#9ca3af",
  ink: "#111827",
  grid: "#e5e7eb",
};

/* ------------------------------------------------------------------ */
/* Dados MOCKADOS (agregados e anônimos — equipe de 24 pessoas)        */
/* ------------------------------------------------------------------ */

// (a) Média de horas trabalhadas por dia da semana — o limite saudável é 8h.
const horasPorDia = [
  { dia: "Seg", horas: 8.4 },
  { dia: "Ter", horas: 8.1 },
  { dia: "Qua", horas: 7.9 },
  { dia: "Qui", horas: 8.6 },
  { dia: "Sex", horas: 7.4 },
];
const LIMITE_SAUDAVEL = 8;

// (b) Evolução do NPS interno / clima — mostra a recuperação com a gestão por cuidado.
const evolucaoNps = [
  { semana: "Sem 1", nps: -42 },
  { semana: "Sem 2", nps: -28 },
  { semana: "Sem 3", nps: -9 },
  { semana: "Sem 4", nps: 6 },
  { semana: "Sem 5", nps: 21 },
  { semana: "Sem 6", nps: 30 },
  { semana: "Sem 7", nps: 38 },
];

// (c) Distribuição de adesão às pausas.
const adesaoPausas = [
  { nome: "Fez as pausas", valor: 17, cor: COR.success },
  { nome: "Parcial", valor: 5, cor: COR.warning },
  { nome: "Não fez", valor: 2, cor: COR.danger },
];
const totalPessoas = adesaoPausas.reduce((s, d) => s + d.valor, 0);

/* ------------------------------------------------------------------ */
/* Wrapper de card de gráfico                                          */
/* ------------------------------------------------------------------ */
function ChartCard({
  titulo,
  descricao,
  children,
  legenda,
}: {
  titulo: string;
  descricao: string;
  children: ReactNode;
  legenda?: ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-bold text-ink">{titulo}</h3>
        <p className="mt-0.5 text-sm text-muted">{descricao}</p>
      </div>
      <div className="min-h-0 flex-1">{children}</div>
      {legenda && <div className="mt-4">{legenda}</div>}
    </div>
  );
}

/* Tooltip com o visual do design system */
function tooltipStyle() {
  return {
    contentStyle: {
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
      fontSize: 13,
    },
    labelStyle: { color: COR.ink, fontWeight: 600 },
  };
}

/* ------------------------------------------------------------------ */
/* (a) Barras — média de horas por dia                                 */
/* ------------------------------------------------------------------ */
function GraficoHoras() {
  return (
    <ChartCard
      titulo="Horas trabalhadas por dia"
      descricao="Média da equipe. A linha marca a jornada saudável de 8h."
      legenda={
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
            Dentro do limite
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-warning" />
            Acima de 8h
          </span>
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={horasPorDia} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COR.grid} vertical={false} />
          <XAxis
            dataKey="dia"
            tickLine={false}
            axisLine={false}
            tick={{ fill: COR.muted, fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: COR.muted, fontSize: 12 }}
            domain={[0, 10]}
          />
          <Tooltip
            {...tooltipStyle()}
            cursor={{ fill: "rgba(99,102,241,0.06)" }}
            formatter={(v) => [`${Number(v).toFixed(1)}h`, "Média"]}
          />
          <ReferenceLine
            y={LIMITE_SAUDAVEL}
            stroke={COR.warning}
            strokeDasharray="5 4"
            strokeWidth={1.5}
          />
          <Bar dataKey="horas" radius={[6, 6, 0, 0]} maxBarSize={46}>
            {horasPorDia.map((d) => (
              <Cell
                key={d.dia}
                fill={d.horas > LIMITE_SAUDAVEL ? COR.warning : COR.primary}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* (b) Linha — evolução do NPS interno                                 */
/* ------------------------------------------------------------------ */
function GraficoNps() {
  return (
    <ChartCard
      titulo="Clima interno (NPS) — recuperação"
      descricao="Clima interno em recuperação com a gestão por cuidado."
    >
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={evolucaoNps} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COR.grid} vertical={false} />
          <XAxis
            dataKey="semana"
            tickLine={false}
            axisLine={false}
            tick={{ fill: COR.muted, fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: COR.muted, fontSize: 12 }}
            domain={[-50, 50]}
          />
          <Tooltip
            {...tooltipStyle()}
            formatter={(v) => [`${Number(v) > 0 ? "+" : ""}${v}`, "NPS"]}
          />
          <ReferenceLine y={0} stroke={COR.muted} strokeWidth={1} />
          <Line
            type="monotone"
            dataKey="nps"
            stroke={COR.primary}
            strokeWidth={3}
            dot={{ r: 3.5, fill: COR.primary, strokeWidth: 0 }}
            activeDot={{ r: 5.5, fill: COR.primary, stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* (c) Donut — adesão às pausas                                        */
/* ------------------------------------------------------------------ */
function GraficoAdesao() {
  return (
    <ChartCard
      titulo="Adesão às pausas"
      descricao="Como a equipe usou as pausas recomendadas nesta semana."
      legenda={
        <ul className="flex flex-col gap-2">
          {adesaoPausas.map((d) => (
            <li key={d.nome} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-ink/80">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: d.cor }}
                />
                {d.nome}
              </span>
              <span className="font-semibold tabular-nums text-ink">
                {d.valor} ({Math.round((d.valor / totalPessoas) * 100)}%)
              </span>
            </li>
          ))}
        </ul>
      }
    >
      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Tooltip
              {...tooltipStyle()}
              formatter={(v, n) => [`${v} pessoas`, n]}
            />
            <Pie
              data={adesaoPausas}
              dataKey="valor"
              nameKey="nome"
              innerRadius={58}
              outerRadius={84}
              paddingAngle={2}
              stroke="none"
            >
              {adesaoPausas.map((d) => (
                <Cell key={d.nome} fill={d.cor} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Centro do donut */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tabular-nums text-ink">
            {Math.round((adesaoPausas[0].valor / totalPessoas) * 100)}%
          </span>
          <span className="text-xs text-muted">aderiram</span>
        </div>
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* Export                                                              */
/* ------------------------------------------------------------------ */
export function GraficosSaude() {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      <div className="lg:col-span-1">
        <GraficoHoras />
      </div>
      <div className="lg:col-span-1">
        <GraficoAdesao />
      </div>
      <div className="lg:col-span-2 xl:col-span-1">
        <GraficoNps />
      </div>
    </section>
  );
}
