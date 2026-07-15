"use client";

import { Coffee, Flame, Smile, Clock } from "lucide-react";
import { PrivacyBanner } from "@/components/gestor/PrivacyBanner";
import { KpiCard, type KpiCardProps } from "@/components/gestor/KpiCard";
import { AlertasGestor } from "@/components/gestor/AlertasGestor";
import { GraficosSaude } from "@/components/gestor/GraficosSaude";
import { GestaoEquipe } from "@/components/gestor/GestaoEquipe";
import { SinaisAtencao } from "@/components/gestor/SinaisAtencao";

/* KPIs de saúde do time — dados MOCKADOS, agregados e anônimos (equipe de 24). */
const KPIS: KpiCardProps[] = [
  {
    icon: Coffee,
    iconClassName: "bg-success-light text-success-dark",
    label: "Adesão a pausas",
    valor: "86%",
    sub: "da equipe fez as pausas recomendadas",
    tendencia: "+9 pts",
    tendenciaTipo: "sobe-bom",
  },
  {
    icon: Flame,
    iconClassName: "bg-danger-light text-danger",
    label: "Risco de burnout",
    valor: "3 de 24",
    sub: "pessoas com jornada estourando",
    tendencia: "−2 vs. mês",
    tendenciaTipo: "desce-bom",
  },
  {
    icon: Smile,
    iconClassName: "bg-primary-light text-primary",
    label: "NPS interno",
    valor: "+38",
    sub: "clima interno em recuperação",
    tendencia: "subindo",
    tendenciaTipo: "sobe-bom",
  },
  {
    icon: Clock,
    iconClassName: "bg-warning/15 text-warning",
    label: "Horas extras médias",
    valor: "2,4h",
    sub: "por pessoa, por semana",
    tendencia: "−0,7h",
    tendenciaTipo: "desce-bom",
  },
];

export default function GestorPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <header>
        <h1 className="text-3xl font-bold text-ink">Painel do Gestor</h1>
        <p className="mt-1 text-muted">
          A saúde da equipe em números agregados — para liderar com cuidado, não
          com vigilância.
        </p>
      </header>

      {/* Banner privacy by design */}
      <PrivacyBanner />

      {/* KPIs de saúde do time */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </section>

      {/* Alertas acionáveis de jornada / hora extra */}
      <AlertasGestor />

      {/* Gráficos agregados */}
      <GraficosSaude />

      {/* Gestão da equipe — só horas de jornada */}
      <GestaoEquipe />

      {/* Sinais de atenção anônimos */}
      <SinaisAtencao />
    </div>
  );
}
