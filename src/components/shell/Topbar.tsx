"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { NotificacoesPainel } from "@/components/notificacoes/NotificacoesPainel";
import { NotificacoesToaster } from "@/components/notificacoes/NotificacoesToaster";
import { useAuthStore } from "@/store/useAuthStore";
import {
  useNotificacoesStore,
  contarNaoLidas,
} from "@/store/useNotificacoesStore";

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export function Topbar() {
  const router = useRouter();
  const usuario = useAuthStore((s) => s.usuario);
  const perfil = useAuthStore((s) => s.perfil);
  const logout = useAuthStore((s) => s.logout);

  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const naoLidas = useNotificacoesStore(contarNaoLidas);
  const painelAberto = useNotificacoesStore((s) => s.painelAberto);
  const togglePainel = useNotificacoesStore((s) => s.togglePainel);
  const fecharPainel = useNotificacoesStore((s) => s.fecharPainel);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuAberto) return;
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuAberto]);

  useEffect(() => {
    if (!painelAberto) return;
    function onClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        fecharPainel();
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [painelAberto, fecharPainel]);

  function sair() {
    setMenuAberto(false);
    logout();
    router.replace("/login");
  }

  const nome = perfil?.full_name ?? usuario?.email?.split("@")[0] ?? "Usuária";
  const cargo = perfil?.cargo ?? "";

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#e5e2ee] bg-white/90 backdrop-blur-sm px-4 md:px-6">
        {/* Espaço reservado para o botão mobile (visível só em < md) */}
        <div className="w-10 md:hidden" />

        {/* Direita */}
        <div className="flex items-center gap-3 md:gap-4 ml-auto">
          <ThemeToggle />

          {/* Notificações */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={togglePainel}
              aria-label="Notificações"
              className={
                "relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors " +
                (painelAberto
                  ? "bg-[#ede9fe] text-[#7b61ff]"
                  : "text-[#5c5870] hover:bg-[#f7f5ff] hover:text-[#7b61ff]")
              }
            >
              <Bell className="h-5 w-5" />
              {naoLidas > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f59e0b] px-1 text-[10px] font-bold text-white">
                  {naoLidas > 9 ? "9+" : naoLidas}
                </span>
              )}
            </button>

            {painelAberto && (
              <div className="absolute right-0 top-full z-50 mt-2">
                <NotificacoesPainel />
              </div>
            )}
          </div>

          {/* Usuário */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuAberto((v) => !v)}
              className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-[#f7f5ff]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ede9fe] text-sm font-bold text-[#7b61ff]">
                {iniciais(nome)}
              </div>
              <div className="hidden leading-tight md:block">
                <p className="text-sm font-bold text-[#1a1b2e]">{nome}</p>
                {cargo && <p className="text-xs text-[#6b6780]">{cargo}</p>}
              </div>
              <ChevronDown
                className={
                  "hidden h-4 w-4 text-[#9b94b0] transition-transform md:block " +
                  (menuAberto ? "rotate-180" : "")
                }
              />
            </button>

            {menuAberto && (
              <div className="absolute right-0 top-full z-40 mt-2 w-52 overflow-hidden rounded-xl border border-[#e5e2ee] bg-white shadow-xl">
                <div className="border-b border-[#e5e2ee] px-4 py-3 md:hidden">
                  <p className="text-sm font-bold text-[#1a1b2e]">{nome}</p>
                  {cargo && <p className="text-xs text-[#6b6780]">{cargo}</p>}
                </div>
                <button
                  type="button"
                  onClick={sair}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-[#5c5870] transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <NotificacoesToaster />
    </>
  );
}
