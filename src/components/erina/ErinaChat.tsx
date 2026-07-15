"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useJornadaStore } from "@/store/useJornadaStore";
import { askErina } from "@/lib/erina/askErina";
import { montarContexto } from "@/lib/erina/contexto";
import { ErinaAvatar } from "./ErinaAvatar";

const SUGESTOES = [
  "Resuma minhas mensagens",
  "Como foi meu dia?",
  "Quais tarefas tenho hoje?",
  "Estou dentro das regras?",
];

/** Pergunta a IA real (rota /api/erina). Retorna a resposta ou null (fallback). */
async function perguntarErinaIA(
  pergunta: string,
  historico: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string | null> {
  try {
    const contexto = montarContexto();
    const res = await fetch("/api/erina", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pergunta, contexto, historico }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { resposta?: string | null };
    return data?.resposta ?? null;
  } catch {
    return null;
  }
}

export function ErinaChat() {
  const chatAberto = useJornadaStore((s) => s.chatAberto);
  const mensagens = useJornadaStore((s) => s.mensagensErina);
  const fecharChat = useJornadaStore((s) => s.fecharChat);

  const [texto, setTexto] = useState("");
  const [pensando, setPensando] = useState(false);
  const fimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens.length, chatAberto, pensando]);

  async function handleEnviar(valor: string) {
    const limpo = valor.trim();
    if (!limpo || pensando) return;

    const store = useJornadaStore.getState();
    // Histórico recente ANTES de adicionar a nova pergunta.
    const historico = store.mensagensErina.slice(-8).map((m) => ({
      role: (m.autor === "erina" ? "assistant" : "user") as "user" | "assistant",
      content: m.texto,
    }));

    store.enviarMensagemUsuario(limpo);
    setTexto("");
    setPensando(true);

    try {
      const respostaIA = await perguntarErinaIA(limpo, historico);
      const resposta =
        respostaIA ?? askErina(useJornadaStore.getState(), limpo);
      useJornadaStore.getState().adicionarMensagemErina(resposta);
    } catch {
      // Rede/erro inesperado → fallback determinístico offline.
      const resposta = askErina(useJornadaStore.getState(), limpo);
      useJornadaStore.getState().adicionarMensagemErina(resposta);
    } finally {
      setPensando(false);
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={fecharChat}
        aria-hidden={!chatAberto}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300",
          chatAberto ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      {/* Painel */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-[400px] flex-col rounded-l-2xl bg-card shadow-2xl transition-transform duration-300 ease-out",
          chatAberto ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-label="Chat com a Erina"
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border-soft px-4 py-3">
          <ErinaAvatar size={40} />
          <div className="flex-1 leading-tight">
            <p className="text-sm font-bold text-ink">Erina</p>
            <p className="text-xs text-muted">Assistente de IA</p>
          </div>
          <button
            type="button"
            onClick={fecharChat}
            aria-label="Fechar chat"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-page hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Corpo rolável */}
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {mensagens.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <ErinaAvatar size={72} />
              <div>
                <p className="text-base font-bold text-ink">
                  Olá! Eu sou a Erina.
                </p>
                <p className="text-sm text-muted">Como posso te ajudar hoje?</p>
              </div>
            </div>
          )}

          {mensagens.map((m) =>
            m.autor === "user" ? (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl bg-primary px-3.5 py-2 text-sm text-white">
                  {m.texto}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex items-end gap-2">
                <div className="shrink-0">
                  <ErinaAvatar size={28} />
                </div>
                <div className="max-w-[80%] whitespace-pre-line rounded-2xl bg-primary-light px-3.5 py-2 text-sm text-ink">
                  {m.texto}
                </div>
              </div>
            )
          )}

          {pensando && (
            <div className="flex items-end gap-2" aria-live="polite">
              <div className="shrink-0">
                <ErinaAvatar size={28} />
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-primary-light px-3.5 py-2.5 text-sm text-muted">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                </span>
                Erina está pensando…
              </div>
            </div>
          )}

          <div ref={fimRef} />
        </div>

        {/* Sugestões */}
        <div className="flex flex-wrap gap-2 border-t border-border-soft px-4 pt-3">
          {SUGESTOES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleEnviar(s)}
              disabled={pensando}
              className="rounded-full bg-primary-light px-3 py-1 text-sm text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Rodapé / input */}
        <div className="px-4 pb-4 pt-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEnviar(texto);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder={pensando ? "Erina está pensando…" : "Digite sua pergunta..."}
              className="flex-1 rounded-xl border border-border-soft bg-page px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-primary"
            />
            <button
              type="submit"
              aria-label="Enviar"
              disabled={pensando || !texto.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-2 text-center text-xs text-muted">
            Erina pode cometer erros. Confira as informações.
          </p>
        </div>
      </aside>
    </>
  );
}
