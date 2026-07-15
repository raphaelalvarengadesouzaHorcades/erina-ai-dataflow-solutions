"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Users,
  UserPlus,
  Trash2,
  Plus,
  X,
  Flame,
  Timer,
  Check,
  ShieldCheck,
  Pencil,
  Sunrise,
  Sun,
  Moon,
  Coffee,
  Clock,
  Crown,
  User,
  Users2,
  List,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";

type StatusJornada = "extra" | "limite" | "ok";
type Turno = "manha" | "tarde" | "noite";
/** Papel do funcionário dentro do time — definido pelo gestor. */
type PapelNoTime = "lider" | "colaborador";

interface Pausa {
  id: string;
  inicio: string; // "HH:MM"
  fim: string; // "HH:MM"
}

interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  /** Time ao qual pertence — o gestor define. */
  time: string;
  /** Team Leader ou colaborador do time — o gestor define. */
  papelNoTime: PapelNoTime;
  /** Jornada cadastrada pelo gestor. */
  turno: Turno;
  entrada: string; // "HH:MM"
  saida: string; // "HH:MM"
  pausas: Pausa[];
  /** Horas trabalhadas hoje, em horas decimais (ex.: 9.2 = 09:12). */
  horasHoje: number;
  /** Horas acumuladas na semana. */
  horasSemana: number;
}

/** Metadados de cada turno + defaults de jornada (preenchem o form, mas são editáveis). */
const TURNO_META: Record<
  Turno,
  {
    label: string;
    icon: LucideIcon;
    entrada: string;
    saida: string;
    pausaAlmoco: { inicio: string; fim: string };
  }
> = {
  manha: {
    label: "Manhã",
    icon: Sunrise,
    entrada: "08:00",
    saida: "17:00",
    pausaAlmoco: { inicio: "12:00", fim: "13:00" },
  },
  tarde: {
    label: "Tarde",
    icon: Sun,
    entrada: "13:00",
    saida: "22:00",
    pausaAlmoco: { inicio: "18:00", fim: "19:00" },
  },
  noite: {
    label: "Noite",
    icon: Moon,
    entrada: "22:00",
    saida: "06:00",
    pausaAlmoco: { inicio: "02:00", fim: "03:00" },
  },
};

const TURNOS: Turno[] = ["manha", "tarde", "noite"];

/** Times sugeridos ao gestor — ele pode escolher um destes ou digitar um novo. */
const TIMES_SUGERIDOS = [
  "Time Produto",
  "Time Backend",
  "Time Design",
  "Time Dados",
  "Time QA",
];

/** Iniciais para o avatar (1ª + última palavra do nome). */
function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

/** Gera as pausas padrão (1 almoço) para um turno. */
function pausasPadrao(turno: Turno): Pausa[] {
  const { pausaAlmoco } = TURNO_META[turno];
  return [
    { id: `p-${Date.now()}`, inicio: pausaAlmoco.inicio, fim: pausaAlmoco.fim },
  ];
}

/* Base MOCKADA — apenas horas de jornada, nunca vigilância. */
const INICIAIS: Funcionario[] = [
  { id: "f1", nome: "Carlos Mendes", cargo: "Desenvolvedor", time: "Time Backend", papelNoTime: "lider", turno: "manha", entrada: "08:00", saida: "17:00", pausas: [{ id: "f1-p1", inicio: "12:00", fim: "13:00" }], horasHoje: 9.2, horasSemana: 47.5 },
  { id: "f2", nome: "Marina Alves", cargo: "Designer de Produto", time: "Time Design", papelNoTime: "lider", turno: "manha", entrada: "09:00", saida: "18:00", pausas: [{ id: "f2-p1", inicio: "13:00", fim: "14:00" }], horasHoje: 7.7, horasSemana: 41.0 },
  { id: "f3", nome: "Rafael Souza", cargo: "Analista de Dados", time: "Time Dados", papelNoTime: "lider", turno: "tarde", entrada: "13:00", saida: "22:00", pausas: [{ id: "f3-p1", inicio: "18:00", fim: "19:00" }], horasHoje: 8.1, horasSemana: 44.8 },
  { id: "f4", nome: "Beatriz Lima", cargo: "Gerente de Projeto", time: "Time Produto", papelNoTime: "lider", turno: "manha", entrada: "08:30", saida: "16:30", pausas: [{ id: "f4-p1", inicio: "12:00", fim: "13:00" }], horasHoje: 6.5, horasSemana: 38.2 },
  { id: "f5", nome: "João Pereira", cargo: "Suporte", time: "Time Produto", papelNoTime: "colaborador", turno: "tarde", entrada: "14:00", saida: "22:00", pausas: [{ id: "f5-p1", inicio: "18:00", fim: "18:30" }], horasHoje: 7.0, horasSemana: 35.5 },
  { id: "f6", nome: "Ana Costa", cargo: "QA", time: "Time QA", papelNoTime: "lider", turno: "manha", entrada: "08:00", saida: "16:00", pausas: [{ id: "f6-p1", inicio: "12:00", fim: "13:00" }], horasHoje: 5.9, horasSemana: 32.0 },
  { id: "f7", nome: "Diego Fernandes", cargo: "Desenvolvedor", time: "Time Backend", papelNoTime: "colaborador", turno: "noite", entrada: "22:00", saida: "06:00", pausas: [{ id: "f7-p1", inicio: "02:00", fim: "03:00" }], horasHoje: 8.0, horasSemana: 40.0 },
];

const LIMITE_DIA = 8; // jornada saudável (horas)
const LIMITE_SEMANA = 44; // limite CLT (horas)

function statusDe(f: Funcionario): StatusJornada {
  if (f.horasHoje > LIMITE_DIA || f.horasSemana > LIMITE_SEMANA) return "extra";
  if (f.horasHoje >= LIMITE_DIA - 0.5 || f.horasSemana >= LIMITE_SEMANA - 2)
    return "limite";
  return "ok";
}

const STATUS_META: Record<
  StatusJornada,
  { label: string; chip: string; icon: LucideIcon; ordem: number }
> = {
  extra: {
    label: "Hora extra",
    chip: "bg-danger-light text-danger",
    icon: Flame,
    ordem: 0,
  },
  limite: {
    label: "Perto do limite",
    chip: "bg-warning/15 text-warning",
    icon: Timer,
    ordem: 1,
  },
  ok: {
    label: "Dentro do limite",
    chip: "bg-success-light text-success-dark",
    icon: Check,
    ordem: 2,
  },
};

/** Converte horas decimais em "HH:MM". */
function hhmm(horasDecimais: number): string {
  const total = Math.round(horasDecimais * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Minutos desde 00:00 a partir de "HH:MM". */
function paraMinutos(hora: string): number {
  const [h, m] = hora.split(":").map((n) => Number.parseInt(n, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
}

/**
 * Duração líquida da jornada (entrada → saída, menos pausas), em horas decimais.
 * Trata turno que vira o dia (ex.: 22:00 → 06:00).
 */
function horasPrevistas(f: Funcionario): number {
  let bruto = paraMinutos(f.saida) - paraMinutos(f.entrada);
  if (bruto <= 0) bruto += 24 * 60; // atravessa a meia-noite
  const pausasMin = f.pausas.reduce((acc, p) => {
    let d = paraMinutos(p.fim) - paraMinutos(p.inicio);
    if (d < 0) d += 24 * 60;
    return acc + Math.max(0, d);
  }, 0);
  return Math.max(0, bruto - pausasMin) / 60;
}

interface RascunhoForm {
  nome: string;
  cargo: string;
  time: string;
  papelNoTime: PapelNoTime;
  turno: Turno;
  entrada: string;
  saida: string;
  pausas: Pausa[];
}

function rascunhoVazio(turno: Turno = "manha"): RascunhoForm {
  const meta = TURNO_META[turno];
  return {
    nome: "",
    cargo: "",
    time: TIMES_SUGERIDOS[0],
    papelNoTime: "colaborador",
    turno,
    entrada: meta.entrada,
    saida: meta.saida,
    pausas: pausasPadrao(turno),
  };
}

export function GestaoEquipe() {
  const [equipe, setEquipe] = useState<Funcionario[]>(INICIAIS);
  const [formAberto, setFormAberto] = useState(false);
  /** id em edição, ou null quando é um novo cadastro. */
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [rascunho, setRascunho] = useState<RascunhoForm>(rascunhoVazio());
  /** Modo de exibição: lista (tabela) ou agrupado por time. */
  const [modo, setModo] = useState<"tabela" | "time">("tabela");

  // Ordena com quem está em hora extra no topo.
  const ordenada = useMemo(
    () =>
      [...equipe].sort(
        (a, b) => STATUS_META[statusDe(a)].ordem - STATUS_META[statusDe(b)].ordem,
      ),
    [equipe],
  );

  const emExtra = useMemo(
    () => equipe.filter((f) => statusDe(f) === "extra").length,
    [equipe],
  );

  // Agrupa a equipe por time, isolando o Team Leader dos colaboradores.
  const times = useMemo(() => {
    const mapa = new Map<string, Funcionario[]>();
    for (const f of equipe) {
      const arr = mapa.get(f.time) ?? [];
      arr.push(f);
      mapa.set(f.time, arr);
    }
    return [...mapa.entries()]
      .map(([nome, membros]) => ({
        nome,
        membros,
        lider: membros.find((m) => m.papelNoTime === "lider") ?? null,
        colaboradores: membros.filter((m) => m.papelNoTime !== "lider"),
      }))
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }, [equipe]);

  function abrirNovo() {
    setEditandoId(null);
    setRascunho(rascunhoVazio());
    setFormAberto(true);
  }

  function abrirEdicao(f: Funcionario) {
    setEditandoId(f.id);
    setRascunho({
      nome: f.nome,
      cargo: f.cargo,
      time: f.time,
      papelNoTime: f.papelNoTime,
      turno: f.turno,
      entrada: f.entrada,
      saida: f.saida,
      // Clona as pausas para editar sem mutar o estado da linha.
      pausas: f.pausas.map((p) => ({ ...p })),
    });
    setFormAberto(true);
  }

  function fecharForm() {
    setFormAberto(false);
    setEditandoId(null);
  }

  /** Troca o turno e preenche entrada/saída/pausas com o default — tudo editável depois. */
  function escolherTurno(turno: Turno) {
    const meta = TURNO_META[turno];
    setRascunho((r) => ({
      ...r,
      turno,
      entrada: meta.entrada,
      saida: meta.saida,
      pausas: pausasPadrao(turno),
    }));
  }

  function alterarPausa(id: string, campo: "inicio" | "fim", valor: string) {
    setRascunho((r) => ({
      ...r,
      pausas: r.pausas.map((p) => (p.id === id ? { ...p, [campo]: valor } : p)),
    }));
  }

  function adicionarPausa() {
    setRascunho((r) => ({
      ...r,
      pausas: [
        ...r.pausas,
        { id: `p-${Date.now()}`, inicio: "15:00", fim: "15:15" },
      ],
    }));
  }

  function removerPausa(id: string) {
    setRascunho((r) => ({
      ...r,
      pausas: r.pausas.filter((p) => p.id !== id),
    }));
  }

  function salvar(e: FormEvent) {
    e.preventDefault();
    const nomeLimpo = rascunho.nome.trim();
    const cargoLimpo = rascunho.cargo.trim();
    const timeLimpo = rascunho.time.trim() || TIMES_SUGERIDOS[0];
    const papel = rascunho.papelNoTime;
    if (!nomeLimpo || !cargoLimpo) return;

    const novoId = `f-${Date.now()}`;

    setEquipe((atual) => {
      let proximo: Funcionario[];
      if (editandoId) {
        proximo = atual.map((f) =>
          f.id === editandoId
            ? {
                ...f,
                nome: nomeLimpo,
                cargo: cargoLimpo,
                time: timeLimpo,
                papelNoTime: papel,
                turno: rascunho.turno,
                entrada: rascunho.entrada,
                saida: rascunho.saida,
                pausas: rascunho.pausas.map((p) => ({ ...p })),
              }
            : f,
        );
      } else {
        proximo = [
          ...atual,
          {
            id: novoId,
            nome: nomeLimpo,
            cargo: cargoLimpo,
            time: timeLimpo,
            papelNoTime: papel,
            turno: rascunho.turno,
            entrada: rascunho.entrada,
            saida: rascunho.saida,
            pausas: rascunho.pausas.map((p) => ({ ...p })),
            horasHoje: 0,
            horasSemana: 0,
          },
        ];
      }

      // Garante 1 Team Leader por time: ao marcar um novo líder, rebaixa o
      // líder anterior daquele time a colaborador.
      if (papel === "lider") {
        const alvoId = editandoId ?? novoId;
        proximo = proximo.map((f) =>
          f.time === timeLimpo && f.id !== alvoId && f.papelNoTime === "lider"
            ? { ...f, papelNoTime: "colaborador" }
            : f,
        );
      }
      return proximo;
    });
    fecharForm();
  }

  function remover(id: string) {
    setEquipe((atual) => atual.filter((f) => f.id !== id));
    if (editandoId === id) fecharForm();
  }

  const formValido = rascunho.nome.trim() !== "" && rascunho.cargo.trim() !== "";
  const previstoRascunho = horasPrevistas({
    ...rascunho,
    id: "",
    horasHoje: 0,
    horasSemana: 0,
  });

  return (
    <section className="rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
            <Users className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div>
            <h3 className="text-base font-bold text-ink">Equipe</h3>
            <p className="mt-0.5 text-sm text-muted">
              {equipe.length}{" "}
              {equipe.length === 1 ? "pessoa" : "pessoas"}
              {emExtra > 0 && (
                <>
                  {" · "}
                  <span className="font-semibold text-danger">
                    {emExtra} em hora extra
                  </span>
                </>
              )}
. O gestor{" "}
              <strong className="font-semibold text-ink">
                define time, Team Leader e colaboradores
              </strong>{" "}
              e cadastra a jornada de cada pessoa — turno, entrada, saída e
              pausas.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => (formAberto ? fecharForm() : abrirNovo())}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
            formAberto
              ? "bg-page text-muted hover:text-ink"
              : "bg-primary text-white hover:bg-primary-hover",
          )}
        >
          {formAberto ? (
            <>
              <X className="h-4 w-4" strokeWidth={2.4} />
              Cancelar
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" strokeWidth={2.4} />
              Adicionar funcionário
            </>
          )}
        </button>
      </div>

      {/* Form inline: cadastrar OU editar jornada */}
      {formAberto && (
        <form
          onSubmit={salvar}
          className="mt-4 flex flex-col gap-4 rounded-xl border border-border-soft bg-page/60 p-4"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={2.4} />
            <p className="text-xs font-semibold text-muted">
              {editandoId
                ? "Editando a jornada — o gestor ajusta turno, horários e pausas."
                : "Novo cadastro — o gestor define a jornada de trabalho abaixo."}
            </p>
          </div>

          {/* Nome + cargo */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex flex-1 flex-col gap-1">
              <span className="text-xs font-semibold text-muted">Nome</span>
              <input
                type="text"
                value={rascunho.nome}
                onChange={(e) =>
                  setRascunho((r) => ({ ...r, nome: e.target.value }))
                }
                placeholder="Ex.: Fernanda Rocha"
                className="rounded-lg border border-border-soft bg-card px-3 py-2 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/30"
                autoFocus
              />
            </label>
            <label className="flex flex-1 flex-col gap-1">
              <span className="text-xs font-semibold text-muted">Cargo</span>
              <input
                type="text"
                value={rascunho.cargo}
                onChange={(e) =>
                  setRascunho((r) => ({ ...r, cargo: e.target.value }))
                }
                placeholder="Ex.: Desenvolvedora"
                className="rounded-lg border border-border-soft bg-card px-3 py-2 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </label>
          </div>

          {/* Time */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-muted">Time</span>
            <div className="flex flex-wrap gap-2">
              {TIMES_SUGERIDOS.map((t) => {
                const ativo = rascunho.time.trim() === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setRascunho((r) => ({ ...r, time: t }))}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
                      ativo
                        ? "border-primary bg-primary text-white"
                        : "border-border-soft bg-card text-muted hover:border-primary hover:text-ink",
                    )}
                  >
                    <Users2 className="h-4 w-4" strokeWidth={2.2} />
                    {t}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={rascunho.time}
              onChange={(e) =>
                setRascunho((r) => ({ ...r, time: e.target.value }))
              }
              placeholder="Ou digite o nome de um novo time"
              className="rounded-lg border border-border-soft bg-card px-3 py-2 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Papel no time */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-muted">
              Papel no time
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setRascunho((r) => ({ ...r, papelNoTime: "lider" }))
                }
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
                  rascunho.papelNoTime === "lider"
                    ? "border-primary bg-primary text-white"
                    : "border-border-soft bg-card text-muted hover:border-primary hover:text-ink",
                )}
              >
                <Crown className="h-4 w-4" strokeWidth={2.2} />
                Team Leader
              </button>
              <button
                type="button"
                onClick={() =>
                  setRascunho((r) => ({ ...r, papelNoTime: "colaborador" }))
                }
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
                  rascunho.papelNoTime === "colaborador"
                    ? "border-primary bg-primary text-white"
                    : "border-border-soft bg-card text-muted hover:border-primary hover:text-ink",
                )}
              >
                <User className="h-4 w-4" strokeWidth={2.2} />
                Colaborador
              </button>
            </div>
            <span className="text-xs text-muted/80">
              O ideal é 1 Team Leader por time — marcar um novo líder rebaixa o
              anterior a colaborador.
            </span>
          </div>

          {/* Turno */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-muted">Turno</span>
            <div className="flex flex-wrap gap-2">
              {TURNOS.map((t) => {
                const meta = TURNO_META[t];
                const TurnoIcon = meta.icon;
                const ativo = rascunho.turno === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => escolherTurno(t)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
                      ativo
                        ? "border-primary bg-primary text-white"
                        : "border-border-soft bg-card text-muted hover:border-primary hover:text-ink",
                    )}
                  >
                    <TurnoIcon className="h-4 w-4" strokeWidth={2.2} />
                    {meta.label}
                  </button>
                );
              })}
            </div>
            <span className="text-xs text-muted/80">
              Escolher o turno preenche horários e pausa padrão — tudo editável
              abaixo.
            </span>
          </div>

          {/* Entrada + saída */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex flex-1 flex-col gap-1">
              <span className="text-xs font-semibold text-muted">Entrada</span>
              <input
                type="time"
                value={rascunho.entrada}
                onChange={(e) =>
                  setRascunho((r) => ({ ...r, entrada: e.target.value }))
                }
                className="rounded-lg border border-border-soft bg-card px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </label>
            <label className="flex flex-1 flex-col gap-1">
              <span className="text-xs font-semibold text-muted">Saída</span>
              <input
                type="time"
                value={rascunho.saida}
                onChange={(e) =>
                  setRascunho((r) => ({ ...r, saida: e.target.value }))
                }
                className="rounded-lg border border-border-soft bg-card px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </label>
          </div>

          {/* Pausas */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted">
                Pausas ({rascunho.pausas.length})
              </span>
              <button
                type="button"
                onClick={adicionarPausa}
                className="inline-flex items-center gap-1 rounded-lg bg-primary-light px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.6} />
                Adicionar pausa
              </button>
            </div>

            {rascunho.pausas.length === 0 && (
              <p className="rounded-lg border border-dashed border-border-soft px-3 py-2.5 text-xs text-muted">
                Sem pausas cadastradas para esta jornada.
              </p>
            )}

            {rascunho.pausas.map((p, idx) => (
              <div
                key={p.id}
                className="flex flex-wrap items-end gap-2 rounded-lg border border-border-soft bg-card p-2.5"
              >
                <span className="inline-flex items-center gap-1 rounded-md bg-warning/15 px-2 py-1 text-xs font-semibold text-warning">
                  <Coffee className="h-3.5 w-3.5" strokeWidth={2.4} />
                  Pausa {idx + 1}
                </span>
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-muted">
                    Início
                  </span>
                  <input
                    type="time"
                    value={p.inicio}
                    onChange={(e) =>
                      alterarPausa(p.id, "inicio", e.target.value)
                    }
                    className="rounded-lg border border-border-soft bg-page px-2.5 py-1.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-muted">
                    Fim
                  </span>
                  <input
                    type="time"
                    value={p.fim}
                    onChange={(e) => alterarPausa(p.id, "fim", e.target.value)}
                    className="rounded-lg border border-border-soft bg-page px-2.5 py-1.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removerPausa(p.id)}
                  aria-label={`Remover pausa ${idx + 1}`}
                  className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-danger-light hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                </button>
              </div>
            ))}
          </div>

          {/* Resumo + ações */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-soft pt-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
              <Clock className="h-4 w-4 text-primary" strokeWidth={2.2} />
              Jornada líquida prevista:{" "}
              <strong className="font-semibold text-ink">
                {hhmm(previstoRascunho)}
              </strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fecharForm}
                className="inline-flex items-center justify-center rounded-lg bg-page px-3 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!formValido}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {editandoId ? (
                  <>
                    <Check className="h-4 w-4" strokeWidth={2.4} />
                    Salvar alterações
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" strokeWidth={2.4} />
                    Incluir
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Alternador de exibição: Tabela x Por time */}
      <div className="mt-4 flex items-center gap-1 rounded-lg border border-border-soft bg-page/60 p-1 w-fit">
        <button
          type="button"
          onClick={() => setModo("tabela")}
          aria-pressed={modo === "tabela"}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
            modo === "tabela"
              ? "bg-card text-ink shadow-sm"
              : "text-muted hover:text-ink",
          )}
        >
          <List className="h-4 w-4" strokeWidth={2.2} />
          Tabela
        </button>
        <button
          type="button"
          onClick={() => setModo("time")}
          aria-pressed={modo === "time"}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
            modo === "time"
              ? "bg-card text-ink shadow-sm"
              : "text-muted hover:text-ink",
          )}
        >
          <LayoutGrid className="h-4 w-4" strokeWidth={2.2} />
          Por time
        </button>
      </div>

      {/* Tabela / lista */}
      {modo === "tabela" && (
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border-soft text-left text-xs font-semibold uppercase tracking-wide text-muted">
              <th className="px-3 py-2.5">Funcionário</th>
              <th className="px-3 py-2.5">Jornada</th>
              <th className="px-3 py-2.5 text-right tabular-nums">Hoje</th>
              <th className="px-3 py-2.5 text-right tabular-nums">Semana</th>
              <th className="px-3 py-2.5">Status</th>
              <th className="px-3 py-2.5 text-right sr-only sm:not-sr-only">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {ordenada.map((f) => {
              const status = statusDe(f);
              const meta = STATUS_META[status];
              const StatusIcon = meta.icon;
              const turnoMeta = TURNO_META[f.turno];
              const TurnoIcon = turnoMeta.icon;
              const emEdicao = editandoId === f.id;
              return (
                <tr
                  key={f.id}
                  className={cn(
                    "border-b border-border-soft/70 last:border-0",
                    status === "extra" && "bg-danger-light/30",
                    emEdicao && "bg-primary-light/40",
                  )}
                >
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                          f.papelNoTime === "lider"
                            ? "bg-primary text-white"
                            : "bg-primary-light text-primary",
                        )}
                        aria-hidden="true"
                      >
                        {iniciais(f.nome)}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-ink">{f.nome}</div>
                        <div className="text-xs text-muted">{f.cargo}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-1">
                          <span className="inline-flex items-center gap-1 rounded-full border border-border-soft bg-page px-2 py-0.5 text-xs font-medium text-muted">
                            <Users2 className="h-3 w-3" strokeWidth={2.4} />
                            {f.time}
                          </span>
                          {f.papelNoTime === "lider" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                              <Crown className="h-3 w-3" strokeWidth={2.4} />
                              Team Leader
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex w-fit items-center gap-1 rounded-full bg-primary-light px-2 py-0.5 text-xs font-semibold text-primary">
                        <TurnoIcon className="h-3.5 w-3.5" strokeWidth={2.4} />
                        {turnoMeta.label}
                      </span>
                      <span className="text-xs font-medium tabular-nums text-ink/80">
                        {f.entrada}–{f.saida}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted">
                        <Coffee className="h-3 w-3" strokeWidth={2.4} />
                        {f.pausas.length}{" "}
                        {f.pausas.length === 1 ? "pausa" : "pausas"}
                      </span>
                    </div>
                  </td>
                  <td
                    className={cn(
                      "px-3 py-3 text-right font-medium tabular-nums",
                      f.horasHoje > LIMITE_DIA ? "text-danger" : "text-ink/80",
                    )}
                  >
                    {hhmm(f.horasHoje)}
                  </td>
                  <td
                    className={cn(
                      "px-3 py-3 text-right font-medium tabular-nums",
                      f.horasSemana > LIMITE_SEMANA
                        ? "text-danger"
                        : "text-ink/80",
                    )}
                  >
                    {hhmm(f.horasSemana)}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        meta.chip,
                      )}
                    >
                      <StatusIcon className="h-3.5 w-3.5" strokeWidth={2.4} />
                      {meta.label}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => abrirEdicao(f)}
                        aria-label={`Editar jornada de ${f.nome}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-primary-light hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" strokeWidth={2.2} />
                      </button>
                      <button
                        type="button"
                        onClick={() => remover(f.id)}
                        aria-label={`Remover ${f.nome}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-danger-light hover:text-danger"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {ordenada.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-sm text-muted">
                  Nenhum funcionário na lista. Adicione alguém para começar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}

      {/* Visualização por time */}
      {modo === "time" && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {times.map((t) => (
            <div
              key={t.nome}
              className="flex flex-col rounded-xl border border-border-soft bg-page/50 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                    <Users2 className="h-4 w-4" strokeWidth={2.3} />
                  </span>
                  <h4 className="text-sm font-bold text-ink">{t.nome}</h4>
                </div>
                <span className="rounded-full bg-card px-2.5 py-0.5 text-xs font-semibold text-muted">
                  {t.membros.length}{" "}
                  {t.membros.length === 1 ? "membro" : "membros"}
                </span>
              </div>

              {/* Team Leader em destaque */}
              {t.lider ? (
                <div className="mt-3 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary-light/50 p-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
                    aria-hidden="true"
                  >
                    {iniciais(t.lider.nome)}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-semibold text-ink">
                        {t.lider.nome}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                        <Crown className="h-3 w-3" strokeWidth={2.4} />
                        Team Leader
                      </span>
                    </div>
                    <div className="text-xs text-muted">{t.lider.cargo}</div>
                  </div>
                </div>
              ) : (
                <p className="mt-3 rounded-lg border border-dashed border-border-soft px-3 py-2.5 text-xs text-muted">
                  Sem Team Leader definido — o gestor pode marcar um responsável
                  por este time.
                </p>
              )}

              {/* Colaboradores */}
              <div className="mt-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Colaboradores ({t.colaboradores.length})
                </span>
                {t.colaboradores.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {t.colaboradores.map((c) => (
                      <span
                        key={c.id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-card py-1 pl-1 pr-2.5 text-xs font-medium text-ink"
                      >
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-[10px] font-bold text-primary"
                          aria-hidden="true"
                        >
                          {iniciais(c.nome)}
                        </span>
                        {c.nome}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-muted">
                    Ainda sem colaboradores neste time.
                  </p>
                )}
              </div>
            </div>
          ))}
          {times.length === 0 && (
            <p className="col-span-full px-3 py-8 text-center text-sm text-muted">
              Nenhum time cadastrado ainda. Adicione funcionários e defina os
              times.
            </p>
          )}
        </div>
      )}

      <p className="mt-4 flex items-start gap-2 rounded-xl bg-success-light/50 px-4 py-3 text-sm text-success-dark">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.3} />
        <span>
          <strong className="font-semibold">Finalidade legal e protetiva:</strong>{" "}
          o gestor cadastra a jornada (turno, horários e pausas) e acompanha
          horas para cumprir a CLT e evitar burnout — nunca prints de tela,
          teclado ou conteúdo de mensagens.
        </span>
      </p>
    </section>
  );
}
