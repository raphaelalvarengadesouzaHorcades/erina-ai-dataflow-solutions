"use client";

import { Sparkles } from "lucide-react";
import { useJornadaStore } from "@/store/useJornadaStore";

export function BannerErina() {
  function handleConversar() {
    useJornadaStore.getState().abrirChat();
  }

  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl bg-primary-light p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary shadow-sm">
          <Sparkles className="h-6 w-6 text-white" strokeWidth={2.2} />
        </span>
        <div>
          <p className="font-bold text-ink">Erina pode te ajudar!</p>
          <p className="text-sm text-muted">
            Pergunte sobre suas horas, pausas, regras e muito mais.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleConversar}
        className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover sm:w-auto"
      >
        <Sparkles className="h-4 w-4" strokeWidth={2.4} />
        Conversar com a Erina
      </button>
    </div>
  );
}
