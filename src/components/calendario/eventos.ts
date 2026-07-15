import type { LucideIcon } from "lucide-react";
import { Briefcase, Coffee, CheckCircle2, Users } from "lucide-react";

/** Tipos de evento que o calendário organiza. */
export type TipoEvento = "jornada" | "pausa" | "tarefa" | "reuniao";

export interface Evento {
  id: string;
  /** Chave da data no formato YYYY-MM-DD (horário local). */
  data: string;
  /** Horário no formato HH:MM. */
  horario: string;
  titulo: string;
  tipo: TipoEvento;
  /** Duração opcional (ex.: "15 min"). */
  duracao?: string;
}

export interface ConfigTipo {
  rotulo: string;
  icone: LucideIcon;
  /** Cor do ponto indicador na grade (fundo sólido). */
  ponto: string;
  /** Chip/círculo do ícone (fundo claro + cor). */
  chip: string;
}

export const TIPOS: Record<TipoEvento, ConfigTipo> = {
  jornada: {
    rotulo: "Jornada",
    icone: Briefcase,
    ponto: "bg-primary",
    chip: "bg-primary-light text-primary",
  },
  pausa: {
    rotulo: "Pausa",
    icone: Coffee,
    ponto: "bg-warning",
    chip: "bg-warning/15 text-warning",
  },
  tarefa: {
    rotulo: "Tarefa",
    icone: CheckCircle2,
    ponto: "bg-success",
    chip: "bg-success-light text-success-dark",
  },
  reuniao: {
    rotulo: "Reunião",
    icone: Users,
    ponto: "bg-danger",
    chip: "bg-danger-light text-danger",
  },
};

export const ORDEM_TIPOS: TipoEvento[] = ["jornada", "pausa", "tarefa", "reuniao"];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Chave YYYY-MM-DD de uma data, usando o fuso local. */
export function chaveData(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Gera um id simples e único o suficiente para o estado local. */
export function novoId(): string {
  return `ev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

/** Data deslocada em `dias` a partir de uma base, preservando o dia local. */
function desloca(base: Date, dias: number): Date {
  return new Date(base.getFullYear(), base.getMonth(), base.getDate() + dias);
}

/**
 * Eventos iniciais (mock). O dia de HOJE absorve a antiga visão de
 * jornada/pausas; outros dias do mês trazem eventos espalhados.
 */
export function eventosIniciais(hoje: Date): Evento[] {
  const kHoje = chaveData(hoje);

  const doDia: Evento[] = [
    { id: novoId(), data: kHoje, horario: "08:00", titulo: "Início da jornada", tipo: "jornada" },
    { id: novoId(), data: kHoje, horario: "10:30", titulo: "Pausa", tipo: "pausa", duracao: "15 min" },
    { id: novoId(), data: kHoje, horario: "12:30", titulo: "Pausa para almoço", tipo: "pausa", duracao: "60 min" },
    { id: novoId(), data: kHoje, horario: "14:00", titulo: "Reunião de sprint", tipo: "reuniao", duracao: "45 min" },
    { id: novoId(), data: kHoje, horario: "17:00", titulo: "Encerramento da jornada", tipo: "jornada" },
  ];

  const espalhados: Array<{ delta: number; horario: string; titulo: string; tipo: TipoEvento; duracao?: string }> = [
    { delta: -3, horario: "09:30", titulo: "Alinhamento com o gestor", tipo: "reuniao", duracao: "30 min" },
    { delta: -1, horario: "15:00", titulo: "Enviar relatório semanal", tipo: "tarefa" },
    { delta: 1, horario: "08:00", titulo: "Início da jornada", tipo: "jornada" },
    { delta: 2, horario: "11:00", titulo: "Revisão de metas", tipo: "tarefa" },
    { delta: 2, horario: "16:00", titulo: "Café com a equipe", tipo: "pausa", duracao: "20 min" },
    { delta: 5, horario: "10:00", titulo: "Reunião com cliente", tipo: "reuniao", duracao: "60 min" },
    { delta: 8, horario: "13:00", titulo: "Treinamento interno", tipo: "tarefa" },
  ];

  const outros: Evento[] = espalhados.map((e) => ({
    id: novoId(),
    data: chaveData(desloca(hoje, e.delta)),
    horario: e.horario,
    titulo: e.titulo,
    tipo: e.tipo,
    duracao: e.duracao,
  }));

  return [...doDia, ...outros];
}

/** Ordena eventos de um dia por horário crescente. */
export function ordenarPorHorario(eventos: Evento[]): Evento[] {
  return [...eventos].sort((a, b) => a.horario.localeCompare(b.horario));
}
