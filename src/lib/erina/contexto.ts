// Helper que reúne o "contexto do dia" da Mariana para a Erina resumir:
// e-mails + WhatsApp, eventos do calendário de hoje, tarefas do quadro e um
// resumo da jornada (horas, saldo, pausas, conformidade CLT).
//
// `montarContexto()` roda no CLIENTE (lê o estado do store) e devolve um objeto
// COMPACTO e serializável. `renderizarContexto()` roda no SERVIDOR (na rota) e
// transforma esse objeto em texto legível para injetar no prompt da IA.

import { EMAILS, CONVERSAS } from "@/components/mensagens/data";
import { eventosIniciais, ordenarPorHorario, chaveData } from "@/components/calendario/eventos";
import {
  useJornadaStore,
  getSaldoSegundos,
  getTotalPausasSegundos,
  getStatusCLT,
} from "@/store/useJornadaStore";
import { formatHM, formatHMSigned } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Formato compacto do contexto (enviado no corpo do POST)             */
/* ------------------------------------------------------------------ */

export interface ContextoEmail {
  de: string;
  assunto: string;
  previa: string;
  naoLido: boolean;
  horario: string;
}

export interface ContextoConversa {
  de: string;
  descricao: string;
  ultimaMsg: string;
  naoLidas: number;
  horario: string;
}

export interface ContextoEvento {
  horario: string;
  titulo: string;
  tipo: string;
  duracao?: string;
}

export interface ContextoTarefa {
  titulo: string;
  status: "A fazer" | "Fazendo" | "Feito";
  prioridade?: string;
  responsavel?: string;
}

export interface ContextoJornada {
  status: string;
  inicio: string;
  trabalhado: string;
  meta: string;
  saldo: string;
  pausas: number;
  totalPausas: string;
  clt: { conforme: boolean; titulo: string; descricao: string };
}

export interface ErinaContexto {
  emails: ContextoEmail[];
  whatsapp: ContextoConversa[];
  eventosHoje: ContextoEvento[];
  tarefas: ContextoTarefa[];
  jornada: ContextoJornada;
}

/* ------------------------------------------------------------------ */
/* Tarefas — o quadro Kanban mantém o estado local no componente e não  */
/* exporta os dados; replicamos aqui o mock inicial para a Erina ter    */
/* do que falar. (Mantido em sincronia com QuadroKanban.TAREFAS_INICIAIS)*/
/* ------------------------------------------------------------------ */

const TAREFAS: ContextoTarefa[] = [
  { titulo: "Escrever testes do módulo de jornada", status: "A fazer", prioridade: "alta", responsavel: "Rafael Andrade" },
  { titulo: "Responder e-mail da Ana (RH)", status: "A fazer", prioridade: "média", responsavel: "Ana (RH)" },
  { titulo: "Atualizar documentação da API", status: "A fazer", prioridade: "baixa", responsavel: "Pedro Lima" },
  { titulo: "Revisar PR do time", status: "Fazendo", prioridade: "alta", responsavel: "Mariana Souza" },
  { titulo: "Reunião de sprint às 14h", status: "Fazendo", prioridade: "média", responsavel: "Carlos Mendes" },
  { titulo: "Deploy na Vercel", status: "Feito", prioridade: "alta", responsavel: "Rafael Andrade" },
  { titulo: "Daily do time às 9h", status: "Feito", prioridade: "baixa", responsavel: "Mariana Souza" },
  { titulo: "Alongar às 15h 😌", status: "Feito", responsavel: "Júlia Costa" },
];

/* ------------------------------------------------------------------ */
/* Montagem (client)                                                    */
/* ------------------------------------------------------------------ */

/** Reúne o contexto do dia num objeto compacto. Roda no cliente. */
export function montarContexto(): ErinaContexto {
  const s = useJornadaStore.getState();

  const emails: ContextoEmail[] = EMAILS.map((e) => ({
    de: e.remetente,
    assunto: e.assunto,
    previa: e.previa,
    naoLido: e.naoLido,
    horario: e.horario,
  }));

  const whatsapp: ContextoConversa[] = CONVERSAS.map((c) => ({
    de: c.nome,
    descricao: c.descricao,
    ultimaMsg: c.ultimaMsg,
    naoLidas: c.naoLidas,
    horario: c.horario,
  }));

  const hoje = new Date();
  const kHoje = chaveData(hoje);
  const eventosHoje: ContextoEvento[] = ordenarPorHorario(
    eventosIniciais(hoje).filter((ev) => ev.data === kHoje)
  ).map((ev) => ({
    horario: ev.horario,
    titulo: ev.titulo,
    tipo: ev.tipo,
    duracao: ev.duracao,
  }));

  const clt = getStatusCLT(s);
  const jornada: ContextoJornada = {
    status:
      s.jornadaStatus === "em_andamento"
        ? "em andamento"
        : s.jornadaStatus === "em_pausa"
          ? "em pausa"
          : "encerrada",
    inicio: s.inicioLabel,
    trabalhado: formatHM(s.segundosTrabalhados),
    meta: formatHM(s.metaSegundos),
    saldo: formatHMSigned(getSaldoSegundos(s)),
    pausas: s.pausas.length,
    totalPausas: formatHM(getTotalPausasSegundos(s)),
    clt: { conforme: clt.conforme, titulo: clt.titulo, descricao: clt.descricao },
  };

  return { emails, whatsapp, eventosHoje, tarefas: TAREFAS, jornada };
}

/* ------------------------------------------------------------------ */
/* Renderização (server) — objeto → texto legível para o prompt         */
/* ------------------------------------------------------------------ */

/** Converte o contexto num bloco de texto pt-BR para injetar no system. */
export function renderizarContexto(ctx: unknown): string {
  const c = ctx as Partial<ErinaContexto> | null | undefined;
  if (!c || typeof c !== "object") return "";

  const partes: string[] = [];

  if (Array.isArray(c.emails) && c.emails.length > 0) {
    const linhas = c.emails.map(
      (e) =>
        `- ${e.naoLido ? "(não lido) " : ""}De ${e.de} — "${e.assunto}" [${e.horario}]: ${e.previa}`
    );
    partes.push(`E-MAILS DA CAIXA DE ENTRADA (${c.emails.length}):\n${linhas.join("\n")}`);
  }

  if (Array.isArray(c.whatsapp) && c.whatsapp.length > 0) {
    const linhas = c.whatsapp.map(
      (w) =>
        `- ${w.de} (${w.descricao})${w.naoLidas > 0 ? ` [${w.naoLidas} não lida(s)]` : ""} [${w.horario}]: ${w.ultimaMsg}`
    );
    partes.push(`MENSAGENS DE WHATSAPP (${c.whatsapp.length}):\n${linhas.join("\n")}`);
  }

  if (Array.isArray(c.eventosHoje) && c.eventosHoje.length > 0) {
    const linhas = c.eventosHoje.map(
      (ev) => `- ${ev.horario} ${ev.titulo} (${ev.tipo}${ev.duracao ? `, ${ev.duracao}` : ""})`
    );
    partes.push(`AGENDA DE HOJE (${c.eventosHoje.length} eventos):\n${linhas.join("\n")}`);
  }

  if (Array.isArray(c.tarefas) && c.tarefas.length > 0) {
    const linhas = c.tarefas.map(
      (t) =>
        `- [${t.status}] ${t.titulo}${t.prioridade ? ` — prioridade ${t.prioridade}` : ""}${t.responsavel ? ` — ${t.responsavel}` : ""}`
    );
    partes.push(`TAREFAS DO QUADRO (${c.tarefas.length}):\n${linhas.join("\n")}`);
  }

  if (c.jornada && typeof c.jornada === "object") {
    const j = c.jornada;
    partes.push(
      [
        "JORNADA DE HOJE:",
        `- Status: ${j.status} (início às ${j.inicio})`,
        `- Trabalhado: ${j.trabalhado} de uma meta de ${j.meta}`,
        `- Saldo do dia: ${j.saldo}`,
        `- Pausas: ${j.pausas} (total ${j.totalPausas})`,
        `- CLT: ${j.clt?.conforme ? "em conformidade" : "atenção"} — ${j.clt?.titulo}. ${j.clt?.descricao}`,
      ].join("\n")
    );
  }

  return partes.join("\n\n");
}
