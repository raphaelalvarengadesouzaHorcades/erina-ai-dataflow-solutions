"use client";

import { JornadaCard } from "@/components/dashboard/JornadaCard";
import { StatusCLTCard } from "@/components/dashboard/StatusCLTCard";
import { ResumoHoje } from "@/components/dashboard/ResumoHoje";
import { BannerErina } from "@/components/dashboard/BannerErina";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardPage() {
  const usuario = useAuthStore((s) => s.usuario);
  const primeiroNome = usuario?.nome?.trim().split(/\s+/)[0] ?? "";

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <header>
        <h1 className="text-3xl font-bold text-ink">
          {primeiroNome ? `Olá, ${primeiroNome} 👋` : "Dashboard"}
        </h1>
        <p className="mt-1 text-muted">
          {usuario?.cargo
            ? `${usuario.cargo} · Visão geral da sua jornada de trabalho`
            : "Visão geral da sua jornada de trabalho"}
        </p>
      </header>

      {/* Linha principal: Jornada (2 col) + Status CLT (1 col) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <JornadaCard />
        </div>
        <div className="lg:col-span-1">
          <StatusCLTCard />
        </div>
      </div>

      {/* Resumo de hoje — largura total */}
      <ResumoHoje />

      {/* Banner da Erina — largura total */}
      <BannerErina />
    </div>
  );
}
