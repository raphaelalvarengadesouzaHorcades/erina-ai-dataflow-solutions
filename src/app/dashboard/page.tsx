"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock,
  Coffee,
  AlertTriangle,
  Power,
  Mail,
  MessageCircle,
  CheckCircle2,
  TrendingUp,
  Timer,
  Zap,
  Brain,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useJornadaStore } from "@/store/useJornadaStore";

export default function DashboardPage() {
  const usuario = useAuthStore((s) => s.usuario);
  const perfil = useAuthStore((s) => s.perfil);
  const primeiroNome = perfil?.full_name?.trim().split(/\s+/)[0] ?? usuario?.email?.split("@")[0] ?? "";

  const [horaAtual, setHoraAtual] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setHoraAtual(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const horas = String(horaAtual.getHours()).padStart(2, "0");
  const minutos = String(horaAtual.getMinutes()).padStart(2, "0");

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1b2e]">
            {primeiroNome ? `Olá, ${primeiroNome} 👋` : "Dashboard"}
          </h1>
          <p className="mt-1 text-sm text-[#6b6780]">
            {perfil?.cargo
              ? `${perfil.cargo} · Visão geral da sua jornada`
              : "Visão geral da sua jornada de trabalho"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-[#7b61ff] tabular-nums">
            {horas}:{minutos}
          </p>
          <p className="text-xs text-[#9b94b0]">
            {horaAtual.toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Cards de ação rápida */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          className="group flex items-center gap-4 rounded-2xl bg-white border border-[#e5e2ee] p-5 text-left transition-all hover:border-[#7b61ff]/30 hover:shadow-lg hover:shadow-[#7b61ff]/10"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ede9fe] text-[#7b61ff] group-hover:scale-110 transition-transform">
            <Coffee className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-[#1a1b2e]">Intervalo</p>
            <p className="text-xs text-[#6b6780]">Pausa com análise da IA</p>
          </div>
        </button>

        <button
          type="button"
          className="group flex items-center gap-4 rounded-2xl bg-white border border-[#e5e2ee] p-5 text-left transition-all hover:border-red-300 hover:shadow-lg hover:shadow-red-100"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 group-hover:scale-110 transition-transform">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-[#1a1b2e]">Emergência</p>
            <p className="text-xs text-[#6b6780]">IA responde automaticamente</p>
          </div>
        </button>

        <button
          type="button"
          className="group flex items-center gap-4 rounded-2xl bg-white border border-[#e5e2ee] p-5 text-left transition-all hover:border-gray-300 hover:shadow-lg"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 group-hover:scale-110 transition-transform">
            <Power className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-[#1a1b2e]">Encerrar</p>
            <p className="text-xs text-[#6b6780]">Finalizar jornada de hoje</p>
          </div>
        </button>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Status da jornada */}
          <div className="rounded-2xl bg-white border border-[#e5e2ee] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1a1b2e] flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#7b61ff]" />
                Status da Jornada
              </h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Em andamento
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-[#f7f5ff] rounded-xl">
                <p className="text-2xl font-bold text-[#7b61ff]">06</p>
                <p className="text-xs text-[#6b6780] mt-1">Horas hoje</p>
              </div>
              <div className="text-center p-4 bg-[#f7f5ff] rounded-xl">
                <p className="text-2xl font-bold text-[#7b61ff]">2</p>
                <p className="text-xs text-[#6b6780] mt-1">Pausas</p>
              </div>
              <div className="text-center p-4 bg-[#f7f5ff] rounded-xl">
                <p className="text-2xl font-bold text-green-600">+24m</p>
                <p className="text-xs text-[#6b6780] mt-1">Saldo</p>
              </div>
            </div>

            {/* Barra de progresso */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6b6780]">Progresso da meta (8h)</span>
                <span className="font-semibold text-[#1a1b2e]">75%</span>
              </div>
              <div className="h-2.5 bg-[#f7f5ff] rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-[#7b61ff] to-[#9b85ff] rounded-full" />
              </div>
            </div>
          </div>

          {/* Card: Resumo rápido */}
          <div className="rounded-2xl bg-white border border-[#e5e2ee] p-6">
            <h2 className="text-lg font-bold text-[#1a1b2e] mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#7b61ff]" />
              Resumo do Dia
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link href="/mensagens" className="group p-4 rounded-xl bg-[#f7f5ff] hover:bg-[#ede9fe] transition-colors">
                <Mail className="h-5 w-5 text-[#7b61ff] mb-2" />
                <p className="text-lg font-bold text-[#1a1b2e]">12</p>
                <p className="text-xs text-[#6b6780]">E-mails</p>
              </Link>
              <Link href="/mensagens" className="group p-4 rounded-xl bg-[#f7f5ff] hover:bg-[#ede9fe] transition-colors">
                <MessageCircle className="h-5 w-5 text-[#7b61ff] mb-2" />
                <p className="text-lg font-bold text-[#1a1b2e]">5</p>
                <p className="text-xs text-[#6b6780]">WhatsApp</p>
              </Link>
              <Link href="/tarefas" className="group p-4 rounded-xl bg-[#f7f5ff] hover:bg-[#ede9fe] transition-colors">
                <CheckCircle2 className="h-5 w-5 text-green-600 mb-2" />
                <p className="text-lg font-bold text-[#1a1b2e]">8/12</p>
                <p className="text-xs text-[#6b6780]">Tarefas</p>
              </Link>
              <div className="p-4 rounded-xl bg-[#f7f5ff]">
                <TrendingUp className="h-5 w-5 text-[#7b61ff] mb-2" />
                <p className="text-lg font-bold text-[#1a1b2e]">92%</p>
                <p className="text-xs text-[#6b6780]">Produtividade</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna lateral */}
        <div className="space-y-6">
          {/* Card: Erina */}
          <div className="rounded-2xl bg-gradient-to-br from-[#7b61ff] to-[#6a4bf5] p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold">Erina</p>
                <p className="text-xs text-white/70">Assistente de IA</p>
              </div>
            </div>
            <p className="text-sm text-white/80 mb-4 leading-relaxed">
              Estou monitorando sua jornada. Tudo está dentro das regras trabalhistas. 
              Precisa de ajuda com alguma demanda?
            </p>
            <button
              type="button"
              className="w-full py-2.5 rounded-xl bg-white/20 text-sm font-semibold hover:bg-white/30 transition-colors"
            >
              Conversar com a Erina
            </button>
          </div>

          {/* Card: Próximas tarefas */}
          <div className="rounded-2xl bg-white border border-[#e5e2ee] p-6">
            <h3 className="font-bold text-[#1a1b2e] mb-4 flex items-center gap-2">
              <Timer className="h-4 w-4 text-[#7b61ff]" />
              Próximas Tarefas
            </h3>
            <div className="space-y-3">
              {[
                { title: "Revisar relatório mensal", time: "14:00", done: false },
                { title: "Reunião com equipe", time: "15:30", done: false },
                { title: "Responder e-mails pendentes", time: "16:00", done: true },
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#f7f5ff]/50">
                  <div className={
                    "mt-0.5 h-4 w-4 rounded border-2 shrink-0 " +
                    (t.done
                      ? "bg-[#7b61ff] border-[#7b61ff]"
                      : "border-[#d4cee5]")
                  }>
                    {t.done && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={
                      "text-sm font-medium truncate " +
                      (t.done ? "text-[#9b94b0] line-through" : "text-[#1a1b2e]")
                    }>
                      {t.title}
                    </p>
                    <p className="text-xs text-[#9b94b0]">{t.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/tarefas"
              className="mt-4 flex items-center justify-center gap-1 text-sm text-[#7b61ff] font-medium hover:underline"
            >
              Ver todas <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Card: Dica de saúde */}
          <div className="rounded-2xl bg-green-50 border border-green-100 p-5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <p className="text-sm font-bold text-green-800">Tudo certo!</p>
            </div>
            <p className="text-xs text-green-700 leading-relaxed">
              Sua jornada está em conformidade com a CLT. Você já fez 2 pausas 
              e está dentro do limite de horas extras.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
