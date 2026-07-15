"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Tema = "dark" | "light";

export function ThemeToggle() {
  const [tema, setTema] = useState<Tema>("dark");
  const [montado, setMontado] = useState(false);

  // Reflete o tema atual (aplicado pelo script anti-FOUC) ao montar
  useEffect(() => {
    const atual =
      (document.documentElement.getAttribute("data-theme") as Tema | null) ??
      "dark";
    setTema(atual === "light" ? "light" : "dark");
    setMontado(true);
  }, []);

  function alternar() {
    const proximo: Tema = tema === "dark" ? "light" : "dark";
    setTema(proximo);
    document.documentElement.setAttribute("data-theme", proximo);
    try {
      localStorage.setItem("tema", proximo);
    } catch {
      // localStorage indisponível — segue apenas em memória
    }
  }

  const ehEscuro = tema === "dark";

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={ehEscuro ? "Ativar tema claro" : "Ativar tema escuro"}
      title={ehEscuro ? "Tema claro" : "Tema escuro"}
      className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary-light hover:text-primary"
    >
      {/* Evita mismatch de hidratação: só mostra o ícone após montar */}
      {montado ? (
        ehEscuro ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )
      ) : (
        <span className="h-5 w-5" />
      )}
    </button>
  );
}
