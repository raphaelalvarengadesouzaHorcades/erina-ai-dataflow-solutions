"use client";

import { useState } from "react";
import {
  User,
  Bell,
  Palette,
  Droplet,
  StretchHorizontal,
  Coffee,
  AlarmClock,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Lembrete {
  id: string;
  icon: LucideIcon;
  titulo: string;
  descricao: string;
}

const lembretes: Lembrete[] = [
  { id: "agua", icon: Droplet, titulo: "Beber água", descricao: "Lembrete a cada 1h para se hidratar" },
  { id: "alongamento", icon: StretchHorizontal, titulo: "Alongamento", descricao: "Pausa para alongar a cada 2h" },
  { id: "pausa", icon: Coffee, titulo: "Pausa para café", descricao: "Sugestão de intervalo no meio do turno" },
  { id: "limite", icon: AlarmClock, titulo: "Limite de jornada", descricao: "Aviso ao se aproximar das 8h de trabalho" },
];

const temas = [
  { id: "claro", label: "Claro", icon: Sun },
  { id: "escuro", label: "Escuro", icon: Moon },
  { id: "sistema", label: "Sistema", icon: Monitor },
] as const;

function Toggle({
  ativo,
  onToggle,
}: {
  ativo: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ativo}
      onClick={onToggle}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        ativo ? "bg-primary" : "bg-border-soft",
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform",
          ativo ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

export default function ConfiguracoesPage() {
  const [lembretesAtivos, setLembretesAtivos] = useState<Record<string, boolean>>({
    agua: true,
    alongamento: true,
    pausa: false,
    limite: true,
  });
  const [tema, setTema] = useState<string>("sistema");

  const toggleLembrete = (id: string) =>
    setLembretesAtivos((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-ink">Configurações</h1>
        <p className="mt-1 text-muted">
          Ajuste seu perfil, os lembretes da Erina e a aparência do app
        </p>
      </header>

      {/* Perfil */}
      <section className="rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-primary">
            <User className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <h2 className="text-lg font-semibold text-ink">Perfil</h2>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
            MS
          </span>
          <div>
            <div className="text-lg font-semibold text-ink">Mariana Souza</div>
            <div className="text-sm text-muted">Desenvolvedora</div>
            <div className="text-sm text-muted">mariana.souza@empresa.com.br</div>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-border-soft pt-5 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">Cargo</dt>
            <dd className="mt-1 text-sm font-medium text-ink">Desenvolvedora Pleno</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">Equipe</dt>
            <dd className="mt-1 text-sm font-medium text-ink">Produto · Squad Erina</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">Jornada</dt>
            <dd className="mt-1 text-sm font-medium text-ink">8h/dia · 40h/semana</dd>
          </div>
        </dl>
      </section>

      {/* Lembretes da Erina */}
      <section className="rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-primary">
            <Bell className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <h2 className="text-lg font-semibold text-ink">Lembretes da Erina</h2>
        </div>
        <p className="mt-1 text-sm text-muted">
          Escolha quais cuidados a Erina deve acompanhar ao longo do seu dia.
        </p>

        <ul className="mt-4 flex flex-col gap-2">
          {lembretes.map((l) => {
            const Icon = l.icon;
            const ativo = lembretesAtivos[l.id];
            return (
              <li
                key={l.id}
                className="flex items-center gap-4 rounded-xl border border-border-soft bg-page p-4"
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    ativo ? "bg-primary-light text-primary" : "bg-border-soft text-muted",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-ink">{l.titulo}</div>
                  <div className="text-sm text-muted">{l.descricao}</div>
                </div>
                <Toggle ativo={ativo} onToggle={() => toggleLembrete(l.id)} />
              </li>
            );
          })}
        </ul>
      </section>

      {/* Aparência */}
      <section className="rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-primary">
            <Palette className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <h2 className="text-lg font-semibold text-ink">Aparência</h2>
        </div>
        <p className="mt-1 text-sm text-muted">
          Defina o tema visual do Controle de Jornada.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {temas.map((t) => {
            const Icon = t.icon;
            const ativo = tema === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTema(t.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-4 text-left transition-colors",
                  ativo
                    ? "border-primary bg-primary-light"
                    : "border-border-soft bg-page hover:border-primary/40",
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    ativo ? "bg-primary text-white" : "bg-card text-muted",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <span
                  className={cn(
                    "font-semibold",
                    ativo ? "text-primary" : "text-ink",
                  )}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
