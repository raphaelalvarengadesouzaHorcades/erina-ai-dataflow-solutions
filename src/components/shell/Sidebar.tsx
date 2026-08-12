"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Inbox,
  Calendar,
  LayoutGrid,
  BarChart3,
  Bell,
  Settings,
  Sparkles,
  ShieldCheck,
  Trophy,
  Users,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useJornadaStore } from "@/store/useJornadaStore";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  gestorOnly?: boolean;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/mensagens", label: "Mensagens", icon: Inbox },
  { href: "/calendario", label: "Calendário", icon: Calendar },
  { href: "/tarefas", label: "Tarefas", icon: LayoutGrid },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/alertas", label: "Lembretes", icon: Bell, badge: "3" },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

const navExtras: NavItem[] = [
  { href: "/transparencia", label: "Transparência", icon: ShieldCheck },
  { href: "/minha-saude", label: "Minha Saúde", icon: Trophy },
  { href: "/gestor", label: "Painel do Gestor", icon: Users, gestorOnly: true },
];

function NavLink({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all " +
        (active
          ? "bg-[#7b61ff] text-white shadow-md shadow-[#7b61ff]/25"
          : "text-[#5c5870] hover:bg-[#ede9fe] hover:text-[#7b61ff]")
      }
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f59e0b] px-1.5 text-[11px] font-bold text-white">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const perfil = useAuthStore((s) => s.perfil);
  const logout = useAuthStore((s) => s.logout);
  const role = perfil?.role;
  const isGestor = role === "gestor";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Fecha mobile ao redimensionar para desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setMobileOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fecha mobile com Escape
  useEffect(() => {
    if (!mobileOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const activeHref = pathname;

  const extrasVisiveis = navExtras.filter(
    (item) => !item.gestorOnly || isGestor
  );

  return (
    <>
      {/* ========================================== */}
      {/* BOTÃO MENU MOBILE — visível só em < md      */}
      {/* ========================================== */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg md:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5 text-[#7b61ff]" />
      </button>

      {/* ========================================== */}
      {/* SIDEBAR DESKTOP — fixo à esquerda           */}
      {/* ========================================== */}
      <aside
        className="sticky top-0 hidden h-screen flex-col border-r border-[#e5e2ee] bg-white md:flex"
        style={{ width: collapsed ? 80 : 260 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7b61ff] to-[#9b85ff]">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-base font-bold text-[#1a1b2e]">Erina</p>
              <p className="text-xs text-[#6b6780]">Controle de Jornada</p>
            </div>
          )}
        </div>

        {/* Nav principal */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={activeHref === item.href || activeHref.startsWith(`${item.href}/`)}
            />
          ))}

          {/* Separador */}
          {!collapsed && (
            <p className="px-3 pb-1 pt-5 text-[11px] font-semibold uppercase tracking-wider text-[#9b94b0]">
              Mais
            </p>
          )}
          {collapsed && <div className="my-2 border-t border-[#e5e2ee]" />}

          {extrasVisiveis.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={activeHref === item.href || activeHref.startsWith(`${item.href}/`)}
            />
          ))}
        </nav>

        {/* Rodapé */}
        <div className="space-y-2 p-3">
          <button
            type="button"
            onClick={() => useJornadaStore.getState().abrirChat()}
            className={
              "flex w-full items-center gap-3 rounded-xl bg-[#ede9fe] py-2.5 text-left transition-colors hover:bg-[#7b61ff]/10 " +
              (collapsed ? "justify-center px-0" : "px-3")
            }
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white">
              <Sparkles className="h-4 w-4 text-[#7b61ff]" />
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 leading-tight">
                  <p className="text-sm font-bold text-[#1a1b2e]">Erina</p>
                  <p className="text-xs text-[#6b6780]">Assistente IA</p>
                </div>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => logout()}
            className={
              "flex w-full items-center gap-3 rounded-xl py-2 text-sm font-medium text-[#5c5870] transition-colors hover:bg-red-50 hover:text-red-500 " +
              (collapsed ? "justify-center px-0" : "px-3")
            }
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="flex-1 text-left">Sair</span>}
          </button>

          {/* Toggle colapsar */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center rounded-lg py-1.5 text-xs text-[#9b94b0] hover:text-[#7b61ff] transition-colors"
          >
            {collapsed ? "→" : "← Recolher"}
          </button>
        </div>
      </aside>

      {/* ========================================== */}
      {/* DRAWER MOBILE — overlay                     */}
      {/* ========================================== */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          {/* Painel */}
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-white shadow-2xl md:hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7b61ff] to-[#9b85ff]">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-base font-bold text-[#1a1b2e]">Erina</p>
                  <p className="text-xs text-[#6b6780]">Controle de Jornada</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#5c5870] hover:bg-[#f7f5ff]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={activeHref === item.href || activeHref.startsWith(`${item.href}/`)}
                  onClick={() => setMobileOpen(false)}
                />
              ))}

              <p className="px-3 pb-1 pt-5 text-[11px] font-semibold uppercase tracking-wider text-[#9b94b0]">
                Mais
              </p>
              {extrasVisiveis.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={activeHref === item.href || activeHref.startsWith(`${item.href}/`)}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </nav>

            {/* Rodapé */}
            <div className="space-y-2 p-3">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  useJornadaStore.getState().abrirChat();
                }}
                className="flex w-full items-center gap-3 rounded-xl bg-[#ede9fe] px-3 py-2.5 text-left"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white">
                  <Sparkles className="h-4 w-4 text-[#7b61ff]" />
                </div>
                <div className="flex-1 leading-tight">
                  <p className="text-sm font-bold text-[#1a1b2e]">Erina</p>
                  <p className="text-xs text-[#6b6780]">Assistente IA</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => logout()}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[#5c5870] hover:bg-red-50 hover:text-red-500"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span>Sair</span>
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
