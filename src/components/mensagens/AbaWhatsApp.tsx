"use client";

import { useState } from "react";
import {
  ArrowLeft,
  MessageCircle,
  Search,
  Send,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CONVERSAS, type Bolha, type Conversa } from "./data";

function Avatar({
  inicial,
  cor,
  online,
  tamanho = "md",
}: {
  inicial: string;
  cor: string;
  online?: boolean;
  tamanho?: "md" | "lg";
}) {
  const dim = tamanho === "lg" ? "h-10 w-10 text-sm" : "h-12 w-12 text-base";
  return (
    <div className="relative shrink-0">
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-semibold",
          dim,
          cor,
        )}
      >
        {inicial}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-success" />
      )}
    </div>
  );
}

export function AbaWhatsApp({ idInicial }: { idInicial?: string }) {
  const temInicial = !!idInicial && CONVERSAS.some((c) => c.id === idInicial);
  const [conversas, setConversas] = useState<Conversa[]>(() =>
    temInicial
      ? CONVERSAS.map((c) => (c.id === idInicial ? { ...c, naoLidas: 0 } : c))
      : CONVERSAS,
  );
  const [selecionadoId, setSelecionadoId] = useState<string | null>(
    temInicial ? idInicial! : CONVERSAS[0].id,
  );
  const [texto, setTexto] = useState("");

  const selecionado = conversas.find((c) => c.id === selecionadoId) ?? null;

  function abrir(id: string) {
    setSelecionadoId(id);
    setTexto("");
    setConversas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, naoLidas: 0 } : c)),
    );
  }

  function enviar() {
    if (!texto.trim() || !selecionado) return;
    const nova: Bolha = {
      id: `${selecionado.id}-${Date.now()}`,
      de: "eu",
      texto: texto.trim(),
      hora: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setConversas((prev) =>
      prev.map((c) =>
        c.id === selecionado.id
          ? { ...c, mensagens: [...c.mensagens, nova], ultimaMsg: nova.texto }
          : c,
      ),
    );
    setTexto("");
  }

  return (
    <div className="flex h-[calc(100vh-15rem)] min-h-[32rem] overflow-hidden rounded-2xl border border-border-soft bg-card shadow-sm">
      {/* LISTA DE CONVERSAS */}
      <aside
        className={cn(
          "flex w-full flex-col border-border-soft md:w-80 md:border-r lg:w-96",
          selecionadoId ? "hidden md:flex" : "flex",
        )}
      >
        <div className="flex items-center gap-2 border-b border-border-soft px-4 py-3">
          <MessageCircle className="h-5 w-5 text-success" />
          <span className="font-semibold text-ink">Conversas</span>
        </div>

        <div className="border-b border-border-soft px-4 py-2.5">
          <div className="flex items-center gap-2 rounded-lg border border-border-soft bg-page px-3 py-2">
            <Search className="h-4 w-4 text-muted" />
            <input
              placeholder="Buscar conversa"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
            />
          </div>
        </div>

        <ul className="flex-1 overflow-y-auto">
          {conversas.map((c) => {
            const ativo = c.id === selecionadoId;
            return (
              <li key={c.id}>
                <button
                  onClick={() => abrir(c.id)}
                  className={cn(
                    "flex w-full items-center gap-3 border-b border-border-soft px-4 py-3 text-left transition hover:bg-primary-light/60",
                    ativo && "bg-primary-light",
                  )}
                >
                  <Avatar inicial={c.inicial} cor={c.cor} online={c.online} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-ink">
                        {c.nome}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 text-xs",
                          c.naoLidas > 0
                            ? "font-semibold text-success"
                            : "text-muted",
                        )}
                      >
                        {c.horario}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm text-muted">
                        {c.ultimaMsg}
                      </span>
                      {c.naoLidas > 0 && (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-success px-1.5 text-[11px] font-bold text-white">
                          {c.naoLidas}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* THREAD */}
      <section
        className={cn(
          "min-w-0 flex-1 flex-col",
          selecionadoId ? "flex" : "hidden md:flex",
        )}
      >
        {selecionado ? (
          <div className="flex h-full flex-col">
            {/* Cabeçalho da conversa */}
            <div className="flex items-center gap-3 border-b border-border-soft px-4 py-3">
              <button
                onClick={() => setSelecionadoId(null)}
                className="rounded-lg p-1 text-muted transition hover:bg-primary-light hover:text-ink md:hidden"
                aria-label="Voltar"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Avatar
                inicial={selecionado.inicial}
                cor={selecionado.cor}
                online={selecionado.online}
                tamanho="lg"
              />
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">
                  {selecionado.nome}
                </p>
                <p className="truncate text-xs text-muted">
                  {selecionado.online ? "online agora" : selecionado.descricao}
                </p>
              </div>
            </div>

            {/* Bolhas */}
            <div className="flex-1 space-y-2 overflow-y-auto bg-page/40 px-4 py-4">
              {selecionado.mensagens.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex",
                    m.de === "eu" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[78%] rounded-2xl px-3.5 py-2 text-sm shadow-sm",
                      m.de === "eu"
                        ? "rounded-br-sm bg-success text-white"
                        : "rounded-bl-sm bg-card text-ink",
                    )}
                  >
                    <p className="whitespace-pre-line leading-relaxed">
                      {m.texto}
                    </p>
                    <span
                      className={cn(
                        "mt-1 block text-right text-[10px]",
                        m.de === "eu" ? "text-white/70" : "text-muted",
                      )}
                    >
                      {m.hora}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Sugestões da Erina (chips) */}
            <div className="border-t border-border-soft px-4 pt-3">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Respostas rápidas da Erina — toque para usar
              </div>
              <div className="flex flex-wrap gap-2">
                {selecionado.sugestoes.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setTexto(s)}
                    className="rounded-full border border-primary/40 bg-primary-light px-3 py-1.5 text-xs font-medium text-primary transition hover:border-primary hover:bg-primary hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Campo de digitar */}
            <div className="flex items-end gap-2 px-4 py-3">
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    enviar();
                  }
                }}
                rows={1}
                placeholder="Digite uma mensagem"
                className="max-h-28 flex-1 resize-none rounded-2xl border border-border-soft bg-card px-4 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-primary"
              />
              <button
                onClick={enviar}
                disabled={!texto.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-success text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Enviar"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="hidden flex-1 flex-col items-center justify-center gap-3 p-8 text-center md:flex">
            <MessageCircle className="h-12 w-12 text-muted/50" />
            <p className="text-sm text-muted">
              Escolha uma conversa para começar.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
