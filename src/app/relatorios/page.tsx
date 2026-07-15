"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Clock, TrendingUp, BarChart3, Zap } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

const ABAS = ["Semana", "Mês", "Período", "Personalizado"] as const;
type Aba = (typeof ABAS)[number];

interface Stat {
  icone: LucideIcon;
  iconClassName: string;
  label: string;
  valor: string;
  valorClassName?: string;
}

const STATS: Stat[] = [
  {
    icone: Clock,
    iconClassName: "bg-primary-light text-primary",
    label: "Horas trabalhadas",
    valor: "02:30",
  },
  {
    icone: BarChart3,
    iconClassName: "bg-primary-light text-primary",
    label: "Média diária",
    valor: "08:30",
  },
  {
    icone: TrendingUp,
    iconClassName: "bg-success-light text-success-dark",
    label: "Saldo da semana",
    valor: "+02:30",
    valorClassName: "text-success-dark",
  },
  {
    icone: Zap,
    iconClassName: "bg-warning/15 text-warning",
    label: "Horas extras",
    valor: "02:30",
    valorClassName: "text-warning",
  },
];

const DADOS_GRAFICO = [
  { dia: "Seg", horas: 8.75 },
  { dia: "Ter", horas: 8.5 },
  { dia: "Qua", horas: 9.25 },
  { dia: "Qui", horas: 8.0 },
  { dia: "Sex", horas: 6.5 },
  { dia: "Sáb", horas: 0 },
  { dia: "Dom", horas: 0 },
];

interface TooltipPayloadItem {
  value: number;
}

function GraficoTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const horas = payload[0].value;
  return (
    <div className="rounded-xl border border-border-soft bg-card px-3 py-2 shadow-sm">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="text-sm font-bold tabular-nums text-ink">
        {horas.toFixed(2).replace(".", ",")} h
      </p>
    </div>
  );
}

export default function RelatoriosPage() {
  const [aba, setAba] = useState<Aba>("Semana");

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-ink">Relatórios</h1>
        <p className="mt-1 text-muted">Acompanhe sua produtividade</p>
      </header>

      {/* Abas */}
      <div className="flex flex-wrap gap-2">
        {ABAS.map((item) => {
          const ativa = item === aba;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setAba(item)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
                ativa
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-primary-light hover:text-primary",
              )}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icone = stat.icone;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border-soft bg-page p-4"
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    stat.iconClassName,
                  )}
                >
                  <Icone className="h-4 w-4" strokeWidth={2.2} />
                </span>
                <span className="text-sm font-medium text-muted">
                  {stat.label}
                </span>
              </div>
              <div
                className={cn(
                  "mt-3 text-2xl font-bold tabular-nums text-ink",
                  stat.valorClassName,
                )}
              >
                {stat.valor}
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráfico */}
      <div className="rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-ink">Horas por dia</h2>
          <span className="text-sm text-muted">Esta semana</span>
        </div>

        <div className="mt-6 h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={DADOS_GRAFICO}
              margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-border-soft)"
              />
              <XAxis
                dataKey="dia"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted)", fontSize: 12 }}
                width={40}
                tickFormatter={(v: number) => `${v}h`}
              />
              <Tooltip
                cursor={{ fill: "var(--color-primary-light)" }}
                content={<GraficoTooltip />}
              />
              <Bar
                dataKey="horas"
                fill="#6366F1"
                radius={[6, 6, 0, 0]}
                maxBarSize={44}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <button
          type="button"
          className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Ver relatório completo
        </button>
      </div>
    </div>
  );
}
