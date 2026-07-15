"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Inbox,
  Mail,
  PenLine,
  Reply,
  Search,
  Send,
  Sparkles,
  SquarePen,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EMAILS, type Email, type RascunhoErina } from "./data";

const TOM_ESTILO: Record<RascunhoErina["tom"], string> = {
  rápido: "bg-success-light text-success",
  cordial: "bg-primary-light text-primary",
  formal: "bg-warning/15 text-warning",
};

function Avatar({
  inicial,
  cor,
  tamanho = "md",
}: {
  inicial: string;
  cor: string;
  tamanho?: "sm" | "md" | "lg";
}) {
  const dim =
    tamanho === "lg"
      ? "h-12 w-12 text-base"
      : tamanho === "sm"
        ? "h-8 w-8 text-xs"
        : "h-10 w-10 text-sm";
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        dim,
        cor,
      )}
    >
      {inicial}
    </div>
  );
}

export function AbaEmail({ idInicial }: { idInicial?: string }) {
  const [emails, setEmails] = useState<Email[]>(() =>
    idInicial && EMAILS.some((e) => e.id === idInicial)
      ? EMAILS.map((e) => (e.id === idInicial ? { ...e, naoLido: false } : e))
      : EMAILS,
  );
  const [selecionadoId, setSelecionadoId] = useState<string | null>(
    idInicial && EMAILS.some((e) => e.id === idInicial)
      ? idInicial
      : EMAILS[0].id,
  );
  const [resposta, setResposta] = useState("");
  const [rascunhoAtivo, setRascunhoAtivo] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [compondo, setCompondo] = useState(false);

  const selecionado = emails.find((e) => e.id === selecionadoId) ?? null;
  const naoLidos = emails.filter((e) => e.naoLido).length;

  function abrirEmail(id: string) {
    setSelecionadoId(id);
    setResposta("");
    setRascunhoAtivo(null);
    setEnviado(false);
    setCompondo(false);
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, naoLido: false } : e)),
    );
  }

  function usarRascunho(r: RascunhoErina) {
    setResposta(r.texto);
    setRascunhoAtivo(r.id);
    setEnviado(false);
  }

  function enviar() {
    if (!resposta.trim()) return;
    setEnviado(true);
    setResposta("");
    setRascunhoAtivo(null);
  }

  return (
    <div className="flex h-[calc(100vh-15rem)] min-h-[32rem] overflow-hidden rounded-2xl border border-border-soft bg-card shadow-sm">
      {/* LISTA */}
      <aside
        className={cn(
          "flex w-full flex-col border-border-soft md:w-80 md:border-r lg:w-96",
          selecionadoId && !compondo ? "hidden md:flex" : "flex",
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-border-soft px-4 py-3">
          <div className="flex items-center gap-2">
            <Inbox className="h-5 w-5 text-primary" />
            <span className="font-semibold text-ink">Caixa de entrada</span>
            {naoLidos > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                {naoLidos}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setCompondo(true);
              setSelecionadoId(null);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-hover"
          >
            <SquarePen className="h-4 w-4" />
            Escrever
          </button>
        </div>

        <div className="border-b border-border-soft px-4 py-2.5">
          <div className="flex items-center gap-2 rounded-lg border border-border-soft bg-page px-3 py-2">
            <Search className="h-4 w-4 text-muted" />
            <input
              placeholder="Buscar e-mails"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
            />
          </div>
        </div>

        <ul className="flex-1 overflow-y-auto">
          {emails.map((email) => {
            const ativo = email.id === selecionadoId && !compondo;
            return (
              <li key={email.id}>
                <button
                  onClick={() => abrirEmail(email.id)}
                  className={cn(
                    "flex w-full gap-3 border-b border-border-soft px-4 py-3 text-left transition hover:bg-primary-light/60",
                    ativo && "bg-primary-light",
                  )}
                >
                  <Avatar inicial={email.inicial} cor={email.cor} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "truncate text-sm",
                          email.naoLido
                            ? "font-semibold text-ink"
                            : "font-medium text-ink/90",
                        )}
                      >
                        {email.remetente}
                      </span>
                      <span className="shrink-0 text-xs text-muted">
                        {email.horario}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "truncate text-sm",
                          email.naoLido ? "font-medium text-ink" : "text-muted",
                        )}
                      >
                        {email.assunto}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {email.previa}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-primary">
                      <Sparkles className="h-3 w-3" />
                      {email.sugestoes.length}{" "}
                      {email.sugestoes.length === 1
                        ? "rascunho pronto"
                        : "rascunhos prontos"}
                    </div>
                  </div>
                  {email.naoLido && (
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* DETALHE / COMPOSITOR */}
      <section
        className={cn(
          "min-w-0 flex-1 flex-col",
          selecionadoId || compondo ? "flex" : "hidden md:flex",
        )}
      >
        {compondo ? (
          <Compositor onFechar={() => setCompondo(false)} />
        ) : selecionado ? (
          <div className="flex h-full flex-col">
            {/* Cabeçalho do e-mail */}
            <div className="flex items-start gap-3 border-b border-border-soft px-5 py-4">
              <button
                onClick={() => setSelecionadoId(null)}
                className="mt-1 rounded-lg p-1 text-muted transition hover:bg-primary-light hover:text-ink md:hidden"
                aria-label="Voltar"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Avatar
                inicial={selecionado.inicial}
                cor={selecionado.cor}
                tamanho="lg"
              />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-bold text-ink">
                  {selecionado.assunto}
                </h2>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm">
                  <span className="font-medium text-ink">
                    {selecionado.remetente}
                  </span>
                  <span className="truncate text-muted">
                    &lt;{selecionado.email}&gt;
                  </span>
                </div>
              </div>
              <span className="shrink-0 text-xs text-muted">
                {selecionado.horario}
              </span>
            </div>

            {/* Corpo + sugestões (rolável) */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="space-y-3 text-sm leading-relaxed text-ink/90">
                {selecionado.corpo.map((par, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {par}
                  </p>
                ))}
              </div>

              {/* Sugestões da Erina */}
              <div className="mt-6 rounded-2xl border border-primary/30 bg-primary-light/70 p-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      Sugestões da Erina
                    </p>
                    <p className="text-xs text-muted">
                      Já deixei rascunhos prontos — é só clicar, revisar e enviar.
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {selecionado.sugestoes.map((r) => {
                    const ativo = rascunhoAtivo === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => usarRascunho(r)}
                        className={cn(
                          "group flex flex-col gap-2 rounded-xl border bg-card p-3 text-left transition hover:border-primary hover:shadow-sm",
                          ativo
                            ? "border-primary ring-1 ring-primary"
                            : "border-border-soft",
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                              TOM_ESTILO[r.tom],
                            )}
                          >
                            {r.tom}
                          </span>
                          {ativo && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-ink">
                          {r.rotulo}
                        </span>
                        <span className="line-clamp-2 text-xs text-muted">
                          {r.texto}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Caixa de resposta */}
            <div className="border-t border-border-soft bg-page/40 px-5 py-4">
              {enviado ? (
                <div className="flex items-center gap-2 rounded-xl bg-success-light px-4 py-3 text-sm font-medium text-success">
                  <CheckCheck className="h-5 w-5" />
                  Resposta enviada com sucesso!
                  <button
                    onClick={() => setEnviado(false)}
                    className="ml-auto text-xs text-muted underline-offset-2 hover:underline"
                  >
                    Nova resposta
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-border-soft bg-card p-3">
                  <div className="mb-2 flex items-center gap-2 text-xs text-muted">
                    <Reply className="h-4 w-4" />
                    Respondendo para{" "}
                    <span className="font-medium text-ink">
                      {selecionado.remetente}
                    </span>
                  </div>
                  <textarea
                    value={resposta}
                    onChange={(e) => {
                      setResposta(e.target.value);
                      setRascunhoAtivo(null);
                    }}
                    rows={4}
                    placeholder="Escreva sua resposta ou escolha um rascunho da Erina acima…"
                    className="w-full resize-none bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                  />
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted">
                      {resposta.trim()
                        ? "Revise antes de enviar ✏️"
                        : "Rascunho vazio"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setResposta("");
                          setRascunhoAtivo(null);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border-soft px-3 py-2 text-sm font-medium text-ink transition hover:bg-primary-light disabled:opacity-40"
                        disabled={!resposta.trim()}
                      >
                        <PenLine className="h-4 w-4" />
                        Limpar
                      </button>
                      <button
                        onClick={enviar}
                        disabled={!resposta.trim()}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Send className="h-4 w-4" />
                        Enviar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden flex-1 flex-col items-center justify-center gap-3 p-8 text-center md:flex">
            <Mail className="h-12 w-12 text-muted/50" />
            <p className="text-sm text-muted">
              Selecione um e-mail para ler e responder.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function Compositor({ onFechar }: { onFechar: () => void }) {
  const [para, setPara] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [gerando, setGerando] = useState(false);

  function escreverComErina() {
    setGerando(true);
    setTimeout(() => {
      setAssunto((a) => a || "Alinhamento sobre o próximo sprint");
      setMensagem(
        "Oi! Tudo bem?\n\nGostaria de alinhar rapidamente os próximos passos do nosso projeto e garantir que estamos na mesma página quanto às prioridades da semana.\n\nVocê tem um horário livre amanhã para uma conversa de 15 minutos? Fico no aguardo.\n\nAbraço,\nMariana Souza",
      );
      setGerando(false);
    }, 700);
  }

  if (enviado) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success-light text-success">
          <CheckCheck className="h-6 w-6" />
        </span>
        <p className="text-base font-semibold text-ink">E-mail enviado!</p>
        <button
          onClick={onFechar}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          Voltar para a caixa
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border-soft px-5 py-4">
        <div className="flex items-center gap-2">
          <SquarePen className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-ink">Novo e-mail</h2>
        </div>
        <button
          onClick={onFechar}
          className="rounded-lg p-1.5 text-muted transition hover:bg-primary-light hover:text-ink"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="mb-3 rounded-xl border border-primary/30 bg-primary-light/70 p-3">
          <button
            onClick={escreverComErina}
            disabled={gerando}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
          >
            <Sparkles className={cn("h-4 w-4", gerando && "animate-pulse")} />
            {gerando ? "A Erina está escrevendo…" : "Escrever com a Erina"}
          </button>
          <p className="mt-2 text-xs text-muted">
            A Erina preenche um rascunho para você só ajustar e enviar.
          </p>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 border-b border-border-soft pb-2">
            <span className="w-16 text-sm text-muted">Para</span>
            <input
              value={para}
              onChange={(e) => setPara(e.target.value)}
              placeholder="destinatario@email.com"
              className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
            />
          </label>
          <label className="flex items-center gap-3 border-b border-border-soft pb-2">
            <span className="w-16 text-sm text-muted">Assunto</span>
            <input
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              placeholder="Assunto do e-mail"
              className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
            />
          </label>
          <textarea
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            rows={10}
            placeholder="Escreva sua mensagem…"
            className="w-full resize-none rounded-xl border border-border-soft bg-page/40 p-3 text-sm leading-relaxed text-ink outline-none placeholder:text-muted focus:border-primary"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-border-soft px-5 py-4">
        <button
          onClick={onFechar}
          className="rounded-lg border border-border-soft px-4 py-2 text-sm font-medium text-ink transition hover:bg-primary-light"
        >
          Descartar
        </button>
        <button
          onClick={() => setEnviado(true)}
          disabled={!para.trim() || !mensagem.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
          Enviar
        </button>
      </div>
    </div>
  );
}
