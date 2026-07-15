"use client";

import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Coffee,
  CalendarClock,
  HeartHandshake,
  Shuffle,
  MessageCircle,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Nivel = "alto" | "medio" | "info";

interface Sinal {
  id: string;
  icon: LucideIcon;
  nivel: Nivel;
  titulo: string;
  detalhe: string;
  acao: { icon: LucideIcon; texto: string };
}

/* Dados MOCKADOS — sempre contagens anônimas, NUNCA nomes. */
const SINAIS: Sinal[] = [
  {
    id: "jornada-limite",
    icon: CalendarClock,
    nivel: "alto",
    titulo: "2 pessoas com jornada acima do limite esta semana",
    detalhe:
      "Passaram de 44h sem compensação. O painel não revela quem — o convite é a uma conversa de cuidado, não a uma cobrança.",
    acao: {
      icon: MessageCircle,
      texto: "Abrir espaço para conversa e checar a carga com o time",
    },
  },
  {
    id: "queda-pausas",
    icon: Coffee,
    nivel: "medio",
    titulo: "1 time com queda de 18% na adesão às pausas",
    detalhe:
      "Menos pausas costumam sinalizar pico de demanda ou pressão de prazo acumulando no grupo.",
    acao: {
      icon: Shuffle,
      texto: "Revisar prazos e redistribuir a carga do período",
    },
  },
  {
    id: "risco-burnout",
    icon: AlertTriangle,
    nivel: "medio",
    titulo: "3 de 24 pessoas em faixa de risco de burnout",
    detalhe:
      "Combinação de horas extras recorrentes e poucas pausas. Indicador agregado — sem identificação individual.",
    acao: {
      icon: HeartHandshake,
      texto: "Oferecer folga, apoio e revisão de metas do trimestre",
    },
  },
];

const NIVEL_STYLE: Record<
  Nivel,
  { chip: string; iconWrap: string; label: string }
> = {
  alto: {
    chip: "bg-danger-light text-danger",
    iconWrap: "bg-danger-light text-danger",
    label: "Atenção",
  },
  medio: {
    chip: "bg-warning/15 text-warning",
    iconWrap: "bg-warning/15 text-warning",
    label: "Observar",
  },
  info: {
    chip: "bg-primary-light text-primary",
    iconWrap: "bg-primary-light text-primary",
    label: "Info",
  },
};

export function SinaisAtencao() {
  return (
    <section className="rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-ink">Sinais de atenção</h3>
          <p className="mt-0.5 text-sm text-muted">
            Padrões do coletivo que pedem uma ação humana — não um alerta sobre
            um indivíduo.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <EyeOff className="h-3.5 w-3.5" strokeWidth={2.4} />
          Anônimo por definição
        </span>
      </div>

      <ul className="mt-5 flex flex-col gap-3">
        {SINAIS.map((s) => {
          const estilo = NIVEL_STYLE[s.nivel];
          const Icone = s.icon;
          const AcaoIcon = s.acao.icon;
          return (
            <li
              key={s.id}
              className="flex flex-col gap-3 rounded-xl border border-border-soft bg-page/60 p-4 sm:flex-row sm:items-start"
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  estilo.iconWrap,
                )}
              >
                <Icone className="h-5 w-5" strokeWidth={2.2} />
              </span>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-ink">{s.titulo}</p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide",
                      estilo.chip,
                    )}
                  >
                    {estilo.label}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-snug text-ink/70">
                  {s.detalhe}
                </p>

                <div className="mt-3 flex items-start gap-2 rounded-lg bg-primary-light/60 px-3 py-2">
                  <AcaoIcon
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    strokeWidth={2.3}
                  />
                  <span className="text-sm font-medium text-primary">
                    {s.acao.texto}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 rounded-xl bg-success-light/50 px-4 py-3 text-sm text-success-dark">
        <strong className="font-semibold">Gestão que cuida:</strong> cada sinal
        vira uma conversa ou um ajuste de carga — nunca um print de tela ou um
        ranking de produtividade individual.
      </p>
    </section>
  );
}
