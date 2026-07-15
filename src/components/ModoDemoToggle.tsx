"use client";

import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useJornadaStore } from "@/store/useJornadaStore";

export function ModoDemoToggle() {
  const modoDemo = useJornadaStore((s) => s.modoDemo);
  const toggleModoDemo = useJornadaStore((s) => s.toggleModoDemo);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={modoDemo}
      onClick={toggleModoDemo}
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
        modoDemo
          ? "border-primary bg-primary-light text-primary"
          : "border-border-soft text-muted hover:bg-page"
      )}
    >
      <Zap
        className={cn("h-4 w-4", modoDemo ? "text-primary" : "text-muted")}
        fill={modoDemo ? "currentColor" : "none"}
      />
      <span className="hidden md:inline">Modo demonstração</span>
      <span
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          modoDemo ? "bg-primary" : "bg-border-soft"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform",
            modoDemo ? "translate-x-4" : "translate-x-0.5"
          )}
        />
      </span>
    </button>
  );
}
