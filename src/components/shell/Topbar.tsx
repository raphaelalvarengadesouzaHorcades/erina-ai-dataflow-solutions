"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Bell, ChevronDown, LogOut } from "lucide-react";
import { ModoDemoToggle } from "@/components/ModoDemoToggle";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { NotificacoesPainel } from "@/components/notificacoes/NotificacoesPainel";
import { NotificacoesToaster } from "@/components/notificacoes/NotificacoesToaster";
import { useAuthStore } from "@/store/useAuthStore";
import { useUiStore } from "@/store/useUiStore";
import {
  useNotificacoesStore,
  contarNaoLidas,
} from "@/store/useNotificacoesStore";
import { cn } from "@/lib/utils";

/** Iniciais a partir do nome completo (ex.: "Mariana Souza" → "MS"). */
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
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const toggleSidebarMobile = useUiStore((s) => s.toggleSidebarMobile);

  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const usuario = useAuthStore((s) => s.usuario);
  const perfil = useAuthStore((s) => s.perfil);
  const logout = useAuthStore((s) => s.logout);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Notificações (sino + painel).
  const naoLidas = useNotificacoesStore(contarNaoLidas);
  const painelAberto = useNotificacoesStore((s) => s.painelAberto);
  const togglePainel = useNotificacoesStore((s) => s.togglePainel);
  const fecharPainel = useNotificacoesStore((s) => s.fecharPainel);
  const notifRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora.
  useEffect(() => {
    if (!menuAberto) return;
    function onClique(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener("mousedown", onClique);
    return () => document.removeEventListener("mousedown", onClique);
  }, [menuAberto]);

  // Fecha o painel de notificações ao clicar fora.
  useEffect(() => {
    if (!painelAberto) return;
    function onClique(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        fecharPainel();
      }
    }
    document.addEventListener("mousedown", onClique);
    return () => document.removeEventListener("mousedown", onClique);
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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border-soft bg-card px-4 md:px-6">
      {/* Esquerda */}
      <div className="flex items-center gap-2">
        {/* Mobile: abre drawer */}
        <button
          type="button"
          onClick={toggleSidebarMobile}
          aria-label="Abrir menu de navegação"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-primary-light hover:text-primary md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        {/* Desktop: recolhe/expande sidebar */}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Recolher ou expandir o menu lateral"
          className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-primary-light hover:text-primary md:flex"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Recolher ou expandir o menu lateral"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-primary-light hover:text-primary"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Direita */}
      <div className="flex items-center gap-3 md:gap-4">
        <ModoDemoToggle />

        <ThemeToggle />

        {/* Sino de notificações + painel dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={togglePainel}
            aria-label="Notificações"
            aria-haspopup="dialog"
            aria-expanded={painelAberto}
            className={cn(
              "relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-primary-light hover:text-primary",
              painelAberto ? "bg-primary-light text-primary" : "text-muted"
            )}
          >
            <Bell className="h-5 w-5" />
            {naoLidas > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-warning px-1 text-[10px] font-semibold text-white">
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

        {/* Usuário + menu Sair */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuAberto((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuAberto}
            className="flex items-center gap-2 rounded-lg px-1 py-1 transition-colors hover:bg-primary-light"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
              {iniciais(nome)}
            </div>
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-bold text-ink">{nome}</p>
              {cargo && <p className="text-xs text-muted">{cargo}</p>}
            </div>
            <ChevronDown
              className={cn(
                "hidden h-4 w-4 text-muted transition-transform sm:block",
                menuAberto && "rotate-180"
              )}
            />
          </button>

          {menuAberto && (
            <div
              role="menu"
              className="absolute right-0 top-full z-40 mt-2 w-52 overflow-hidden rounded-xl border border-border-soft bg-card shadow-xl"
            >
              <div className="border-b border-border-soft px-4 py-3 sm:hidden">
                <p className="text-sm font-bold text-ink">{nome}</p>
                {cargo && <p className="text-xs text-muted">{cargo}</p>}
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={sair}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-muted transition-colors hover:bg-danger/10 hover:text-danger"
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
