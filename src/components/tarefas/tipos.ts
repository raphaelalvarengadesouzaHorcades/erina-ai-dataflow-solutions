export type Prioridade = "alta" | "media" | "baixa";

export type ColunaId = "afazer" | "fazendo" | "feito";

export interface Membro {
  id: string;
  nome: string;
  /** iniciais para o avatar (ex.: "MS") */
  iniciais: string;
  /** função/área para dar contexto ao gestor */
  cargo: string;
  /** classes semânticas do avatar (fundo + texto), somente tokens */
  cor: string;
}

export interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  prioridade?: Prioridade;
  /** pessoa do time responsável pela tarefa */
  responsavel: Membro;
}

export interface Coluna {
  id: ColunaId;
  titulo: string;
  /** classe de cor sutil para o acento da coluna */
  acento: string;
}

export const COLUNAS: Coluna[] = [
  { id: "afazer", titulo: "A fazer", acento: "bg-muted" },
  { id: "fazendo", titulo: "Fazendo", acento: "bg-primary" },
  { id: "feito", titulo: "Feito", acento: "bg-success" },
];

export const PRIORIDADES: Record<
  Prioridade,
  { rotulo: string; classe: string }
> = {
  alta: {
    rotulo: "Alta",
    classe: "bg-danger-light text-danger",
  },
  media: {
    rotulo: "Média",
    classe: "bg-warning/15 text-warning",
  },
  baixa: {
    rotulo: "Baixa",
    classe: "bg-primary-light text-primary",
  },
};

/* ------------------------------------------------------------------ */
/* Time (mock) — usado no seletor de responsável e nos avatares        */
/* ------------------------------------------------------------------ */

export const EQUIPE: Membro[] = [
  {
    id: "m1",
    nome: "Mariana Souza",
    iniciais: "MS",
    cargo: "Produto",
    cor: "bg-primary text-white",
  },
  {
    id: "m2",
    nome: "Rafael Andrade",
    iniciais: "RA",
    cargo: "Engenharia",
    cor: "bg-success text-white",
  },
  {
    id: "m3",
    nome: "Ana (RH)",
    iniciais: "AN",
    cargo: "Pessoas & Cultura",
    cor: "bg-warning text-white",
  },
  {
    id: "m4",
    nome: "Carlos Mendes",
    iniciais: "CM",
    cargo: "Design",
    cor: "bg-danger text-white",
  },
  {
    id: "m5",
    nome: "Pedro Lima",
    iniciais: "PL",
    cargo: "Dados",
    cor: "bg-primary-light text-primary",
  },
  {
    id: "m6",
    nome: "Júlia Costa",
    iniciais: "JC",
    cargo: "Marketing",
    cor: "bg-success-light text-success",
  },
];

/** Retorna um membro pelo id, com fallback no primeiro da lista. */
export function membroPorId(id: string): Membro {
  return EQUIPE.find((m) => m.id === id) ?? EQUIPE[0];
}
