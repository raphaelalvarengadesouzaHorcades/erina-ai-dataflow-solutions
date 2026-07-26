"use client";

import { useState } from "react";
import { Pause, Play, StopCircle, Coffee, AlertTriangle, X, Mail, MessageCircle, FileText, CheckCircle } from "lucide-react";
import { useJornadaStore } from "@/store/useJornadaStore";
import { usePausaStore } from "@/store/usePausaStore";
import { useAuthStore } from "@/store/useAuthStore";
import { formatHMS, cn } from "@/lib/utils";

/** Bloco de um grupo do cronômetro. */
function TimeGroup({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-6xl font-bold tabular-nums leading-none text-ink sm:text-7xl">
        {value}
      </span>
      <span className="mt-2 text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </span>
    </div>
  );
}

function Separador() {
  return (
    <span className="text-5xl font-bold leading-none text-border-soft sm:text-6xl">
      :
    </span>
  );
}

/** Formata duração em MM:SS. */
function formatMMSS(totalSegundos: number): string {
  const s = Math.max(0, Math.floor(totalSegundos));
  if (s >= 3600) return formatHMS(s);
  const minutos = Math.floor(s / 60);
  const segundos = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(minutos)}:${pad(segundos)}`;
}

/** Modal de resumo da pausa. */
function ResumoModal({ resumo, onClose }: { resumo: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {resumo.is_emergency ? (
              <AlertTriangle className="w-6 h-6 text-red-500" />
            ) : (
              <CheckCircle className="w-6 h-6 text-green-500" />
            )}
            <h3 className="text-xl font-bold text-[#1a1b2e]">
              {resumo.is_emergency ? "Resumo da Emergência" : "Resumo do Intervalo"}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <p className="text-[#5c5870] mb-4 leading-relaxed">{resumo.summary_text}</p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-[#f7f5ff] rounded-xl p-3 text-center">
            <FileText className="w-5 h-5 mx-auto mb-1 text-[#7b61ff]" />
            <div className="text-lg font-bold text-[#1a1b2e]">{resumo.demands_count}</div>
            <div className="text-xs text-[#6b6780]">Demandas</div>
          </div>
          <div className="bg-[#f7f5ff] rounded-xl p-3 text-center">
            <Mail className="w-5 h-5 mx-auto mb-1 text-[#7b61ff]" />
            <div className="text-lg font-bold text-[#1a1b2e]">{resumo.emails_count}</div>
            <div className="text-xs text-[#6b6780]">E-mails</div>
          </div>
          <div className="bg-[#f7f5ff] rounded-xl p-3 text-center">
            <MessageCircle className="w-5 h-5 mx-auto mb-1 text-[#7b61ff]" />
            <div className="text-lg font-bold text-[#1a1b2e]">{resumo.messages_count}</div>
            <div className="text-xs text-[#6b6780]">Mensagens</div>
          </div>
        </div>

        {resumo.actions_taken && resumo.actions_taken.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3">
            <h4 className="text-sm font-semibold text-green-800 mb-2">Ações automáticas realizadas:</h4>
            <ul className="space-y-1">
              {resumo.actions_taken.map((acao: any, i: number) => (
                <li key={i} className="text-sm text-green-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {acao.description || acao}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 bg-[#7b61ff] text-white font-semibold rounded-xl hover:bg-[#6a4bf5] transition-colors"
        >
          Entendido, voltar ao trabalho
        </button>
      </div>
    </div>
  );
}

export function JornadaCard() {
  const jornadaStatus = useJornadaStore((s) => s.jornadaStatus);
  const inicioLabel = useJornadaStore((s) => s.inicioLabel);
  const segundosTrabalhados = useJornadaStore((s) => s.segundosTrabalhados);
  const segundosPausaAtual = useJornadaStore((s) => s.segundosPausaAtual);
  const metaPausaSegundos = useJornadaStore((s) => s.metaPausaSegundos);
  const iniciarPausaJornada = useJornadaStore((s) => s.iniciarPausa);
  const encerrarPausaJornada = useJornadaStore((s) => s.encerrarPausa);

  const usuario = useAuthStore((s) => s.usuario);
  const perfil = useAuthStore((s) => s.perfil);

  const pausaAtual = usePausaStore((s) => s.pausaAtual);
  const resumoAtual = usePausaStore((s) => s.resumoAtual);
  const carregando = usePausaStore((s) => s.carregando);
  const iniciarPausaReal = usePausaStore((s) => s.iniciarPausa);
  const encerrarPausaReal = usePausaStore((s) => s.encerrarPausa);

  const [mostrarResumo, setMostrarResumo] = useState(false);

  const [hh, mm, ss] = formatHMS(segundosTrabalhados).split(":");

  const emPausa = jornadaStatus === "em_pausa";
  const encerrada = jornadaStatus === "encerrada";

  const excedeuPausa = segundosPausaAtual > metaPausaSegundos;
  const restantePausa = Math.max(0, metaPausaSegundos - segundosPausaAtual);
  const progressoPausa = metaPausaSegundos > 0 ? Math.min(1, segundosPausaAtual / metaPausaSegundos) : 0;

  const statusTexto = emPausa
    ? pausaAtual?.type === "emergencia"
      ? "🚨 EMERGÊNCIA"
      : pausaAtual?.type === "intervalo"
      ? "☕ Em intervalo"
      : "⏸️ Em pausa"
    : encerrada
    ? "Jornada encerrada"
    : "Jornada em andamento";

  const statusCor = emPausa
    ? pausaAtual?.type === "emergencia"
      ? "text-red-500"
      : "text-warning"
    : encerrada
    ? "text-muted"
    : "text-ink";

  const pontoCor = emPausa
    ? pausaAtual?.type === "emergencia"
      ? "bg-red-500"
      : "bg-warning"
    : encerrada
    ? "bg-muted"
    : "bg-success";

  async function handleIntervalo() {
    if (!usuario?.id) return;

    if (emPausa) {
      // Encerrar pausa
      await encerrarPausaReal(usuario.id);
      encerrarPausaJornada();
      if (resumoAtual) {
        setMostrarResumo(true);
      }
    } else {
      // Iniciar intervalo
      const result = await iniciarPausaReal(usuario.id, "intervalo");
      if (result.ok) {
        iniciarPausaJornada();
        // Notificar n8n
        notificarN8n("intervalo", result.data?.id);
      }
    }
  }

  async function handleEmergencia() {
    if (!usuario?.id) return;

    if (emPausa && pausaAtual?.type === "emergencia") {
      // Encerrar emergência
      await encerrarPausaReal(usuario.id);
      encerrarPausaJornada();
      if (resumoAtual) {
        setMostrarResumo(true);
      }
    } else {
      // Iniciar emergência
      const result = await iniciarPausaReal(usuario.id, "emergencia");
      if (result.ok) {
        iniciarPausaJornada();
        // Notificar n8n
        notificarN8n("emergencia", result.data?.id);
      }
    }
  }

  async function notificarN8n(tipo: "intervalo" | "emergencia", pauseId?: string) {
    try {
      await fetch("/api/webhooks/n8n/pause", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: usuario?.id,
          pause_id: pauseId,
          type: tipo,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // Silencioso - não bloqueia a UX
    }
  }

  function handleEncerrar() {
    useJornadaStore.getState().encerrarJornada();
  }

  function handleIniciar() {
    useJornadaStore.getState().iniciarJornada();
  }

  return (
    <>
      <div className="flex h-full flex-col rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            {!encerrada && (
              <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", pontoCor)} />
            )}
            <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", pontoCor)} />
          </span>
          <span className={cn("text-sm font-semibold", statusCor)}>
            {statusTexto}
          </span>
          {!encerrada && <span className="text-sm text-muted">· Desde {inicioLabel}</span>}
        </div>

        {/* Área central */}
        {emPausa ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 py-8">
            <div className="flex flex-col items-center">
              <span className={cn(
                "text-6xl font-bold tabular-nums leading-none sm:text-7xl",
                pausaAtual?.type === "emergencia" ? "text-red-500" : "text-warning"
              )}>
                {formatHMS(segundosPausaAtual)}
              </span>
              <span className="mt-2 text-xs font-medium uppercase tracking-wide text-muted">
                {pausaAtual?.type === "emergencia" ? "em emergência" : "em pausa"}
              </span>
            </div>

            <div className="w-full max-w-xs">
              {excedeuPausa ? (
                <p className="text-center text-sm font-semibold text-warning">
                  Pausa {formatMMSS(Math.max(0, segundosPausaAtual - metaPausaSegundos))} acima do recomendado
                </p>
              ) : (
                <p className="text-center text-sm font-medium text-muted">
                  Faltam <span className="tabular-nums font-semibold text-ink">{formatMMSS(restantePausa)}</span>
                </p>
              )}
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border-soft">
                <div className={cn("h-full rounded-full transition-[width] duration-500", excedeuPausa ? "bg-warning" : "bg-primary")} style={{ width: `${(excedeuPausa ? 1 : progressoPausa) * 100}%` }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center py-8">
            <div className="flex items-start gap-3 sm:gap-5">
              <TimeGroup value={hh} label="horas" />
              <div className="pt-2"><Separador /></div>
              <TimeGroup value={mm} label="minutos" />
              <div className="pt-2"><Separador /></div>
              <TimeGroup value={ss} label="segundos" />
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex flex-col gap-3">
          {encerrada ? (
            <button type="button" onClick={handleIniciar} className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90">
              <Play className="h-4 w-4" strokeWidth={2.4} />
              Iniciar jornada
            </button>
          ) : emPausa ? (
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={pausaAtual?.type === "emergencia" ? handleEmergencia : handleIntervalo}
                disabled={carregando}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-colors",
                  pausaAtual?.type === "emergencia"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-success hover:bg-success/90"
                )}
              >
                <Play className="h-4 w-4" strokeWidth={2.4} />
                {carregando ? "Salvando..." : "Voltar ao trabalho"}
              </button>
            </div>
          ) : (
            <>
              {/* Linha 1: Intervalo e Emergência */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleIntervalo}
                  disabled={carregando}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ede9fe] px-4 py-3 text-sm font-semibold text-[#7b61ff] transition-colors hover:bg-[#7b61ff] hover:text-white"
                >
                  <Coffee className="h-4 w-4" strokeWidth={2.4} />
                  {carregando ? "Salvando..." : "Intervalo"}
                </button>

                <button
                  type="button"
                  onClick={handleEmergencia}
                  disabled={carregando}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500 hover:text-white border border-red-200"
                >
                  <AlertTriangle className="h-4 w-4" strokeWidth={2.4} />
                  {carregando ? "Salvando..." : "Emergência"}
                </button>
              </div>

              {/* Linha 2: Encerrar jornada */}
              <button
                type="button"
                onClick={handleEncerrar}
                className="flex items-center justify-center gap-2 rounded-xl bg-danger px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-danger/90"
              >
                <StopCircle className="h-4 w-4" strokeWidth={2.4} />
                Encerrar jornada
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal de resumo */}
      {mostrarResumo && resumoAtual && (
        <ResumoModal resumo={resumoAtual} onClose={() => setMostrarResumo(false)} />
      )}
    </>
  );
}
