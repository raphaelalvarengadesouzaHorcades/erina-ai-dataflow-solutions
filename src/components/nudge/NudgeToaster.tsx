"use client";

import { useJornadaStore } from "@/store/useJornadaStore";
import { NudgeToast } from "./NudgeToast";

/**
 * Máximo de toasts visíveis ao mesmo tempo. Os demais ficam na fila
 * (no store) e aparecem assim que um sai — nunca empilha uma pilha.
 */
const MAX_VISIVEIS = 2;

export function NudgeToaster() {
  const nudges = useJornadaStore((s) => s.nudges);

  if (nudges.length === 0) return null;

  // Mostra os mais antigos primeiro (FIFO); o resto espera a vez.
  const visiveis = nudges.slice(0, MAX_VISIVEIS);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3">
      {visiveis.map((nudge) => (
        <div key={nudge.id} className="pointer-events-auto">
          <NudgeToast nudge={nudge} />
        </div>
      ))}
    </div>
  );
}
