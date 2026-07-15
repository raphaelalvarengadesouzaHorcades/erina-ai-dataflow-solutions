"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Droplet,
  Activity,
  Mail,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ResumoMensagensModal from "@/components/lembretes/ResumoMensagensModal";

interface Lembrete {
  icone: LucideIcon;
  titulo: string;
  descricao: string;
  horario: string;
  iconClassName: string;
  cardClassName: string;
}

const LEMBRETES: Lembrete[] = [
  {
    icone: AlertTriangle,
    titulo: "Jornada próxima do limite",
    descricao: "Faltam 30 min para o limite diário.",
    horario: "16:30",
    iconClassName: "bg-warning/15 text-warning",
    cardClassName: "border-warning/30 bg-warning/[0.06]",
  },
  {
    icone: AlertCircle,
    titulo: "Intervalo não realizado",
    descricao: "Você ainda não registrou seu intervalo.",
    horario: "12:30",
    iconClassName: "bg-danger-light text-danger",
    cardClassName: "border-danger/30 bg-danger-light/40",
  },
  {
    icone: CheckCircle2,
    titulo: "Banco de horas positivo",
    descricao: "Você tem 08:15 de saldo positivo.",
    horario: "Ontem",
    iconClassName: "bg-success-light text-success",
    cardClassName: "border-success/30 bg-success-light/40",
  },
  {
    icone: Droplet,
    titulo: "Hora de se hidratar 💧",
    descricao: "Que tal uma pausa rápida pra beber água?",
    horario: "15:00",
    iconClassName: "bg-primary-light text-primary",
    cardClassName: "border-primary/30 bg-primary-light/50",
  },
  {
    icone: Activity,
    titulo: "Que tal se alongar? 🧘",
    descricao: "Um alongamento de 2 minutos faz bem pro corpo.",
    horario: "14:00",
    iconClassName: "bg-primary-light text-primary",
    cardClassName: "border-primary/30 bg-primary-light/50",
  },
];

interface ResumoPausa {
  titulo: string;
  detalhe: string;
  emails: number;
  whatsapp: number;
}

const RESUMOS: ResumoPausa[] = [
  {
    titulo: "Pausa das 10:30",
    detalhe: "Café da manhã · 15 min",
    emails: 3,
    whatsapp: 5,
  },
  {
    titulo: "Almoço das 12:30",
    detalhe: "Intervalo · 52 min",
    emails: 2,
    whatsapp: 8,
  },
  {
    titulo: "Pausa das 15:30",
    detalhe: "Descanso · 10 min",
    emails: 1,
    whatsapp: 4,
  },
];

export default function LembretesPage() {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-ink">Lembretes & Resumos</h1>
        <p className="mt-1 text-muted">
          Seus avisos e o que você perdeu nas pausas
        </p>
      </header>

      {/* Seção 1 — Lembretes */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">Lembretes</h2>

        <div className="space-y-3">
          {LEMBRETES.map((lembrete) => {
            const Icone = lembrete.icone;
            return (
              <div
                key={lembrete.titulo}
                className={cn(
                  "flex items-start gap-4 rounded-2xl border p-5 shadow-sm",
                  lembrete.cardClassName,
                )}
              >
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                    lembrete.iconClassName,
                  )}
                >
                  <Icone className="h-5 w-5" strokeWidth={2.2} />
                </span>

                <div className="flex-1">
                  <p className="font-semibold text-ink">{lembrete.titulo}</p>
                  <p className="mt-0.5 text-muted">{lembrete.descricao}</p>
                </div>

                <span className="shrink-0 text-sm text-muted">
                  {lembrete.horario}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Seção 2 — Resumos de mensagens */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              Resumos de mensagens
            </h2>
            <p className="mt-0.5 text-sm text-muted">
              O que chegou enquanto você descansava
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalAberto(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <Sparkles className="h-4 w-4" strokeWidth={2.2} />
            Ver resumo da última pausa
          </button>
        </div>

        <div className="space-y-3">
          {RESUMOS.map((resumo) => (
            <div
              key={resumo.titulo}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-border-soft bg-card p-5 shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{resumo.titulo}</p>
                <p className="mt-0.5 text-sm text-muted">{resumo.detalhe}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">
                    <Mail className="h-3.5 w-3.5" strokeWidth={2.2} />
                    {resumo.emails} e-mails
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success-light px-3 py-1 text-xs font-medium text-success">
                    <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.2} />
                    {resumo.whatsapp} WhatsApp
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalAberto(true)}
                className="inline-flex shrink-0 items-center rounded-xl border border-border-soft px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-light"
              >
                Ver resumo
              </button>
            </div>
          ))}
        </div>
      </section>

      <ResumoMensagensModal
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
      />
    </div>
  );
}
