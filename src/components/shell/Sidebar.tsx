"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  Mail,
  Coffee,
  ListChecks,
  MessageSquare,
  BookOpen,
  Settings,
  Moon,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useJornadaStore } from "@/store/useJornadaStore";

interface NavItem {
  href?: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const perfil = useAuthStore((s) => s.perfil);
  const logout = useAuthStore((s) => s.logout);
  const abrirChat = useJornadaStore((s) => s.abrirChat);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [tema, setTema] = useState<"dark" | "light">("light");

  useEffect(() => {
    const atual = (document.documentElement.getAttribute("data-theme") as "dark" | "light" | null) ?? "light";
    setTema(atual);
  }, []);

  const toggleTema = useCallback(() => {
    const proximo = tema === "dark" ? "light" : "dark";
    setTema(proximo);
    document.documentElement.setAttribute("data-theme", proximo);
    try {
      localStorage.setItem("tema", proximo);
    } catch {}
  }, [tema]);

  const navGroups: NavGroup[] = [
    {
      title: "PRODUTIVIDADE",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { label: "Assistente Erina", icon: Bot, onClick: () => abrirChat() },
        { href: "/mensagens", label: "E-mails (Workspace)", icon: Mail, badge: "3" },
        { href: "/pausas", label: "Modo Intervalo", icon: Coffee },
        { href: "/tarefas", label: "Minhas Demandas", icon: ListChecks },
        { href: "/mensagens", label: "WhatsApp", icon: MessageSquare },
        { href: "/transparencia", label: "Documentação & Processos", icon: BookOpen },
      ],
    },
    {
      title: "SISTEMA",
      items: [
        { href: "/configuracoes", label: "Configurações", icon: Settings },
        { label: "Modo escuro", icon: Moon, onClick: () => toggleTema() },
        { label: "Sair", icon: LogOut, onClick: () => logout() },
      ],
    },
  ];

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

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    const className =
      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all " +
      (active
        ? "bg-[#7b61ff] text-white shadow-md shadow-[#7b61ff]/25"
        : "text-[#5c5870] hover:bg-[#ede9fe] hover:text-[#7b61ff]");

    if (item.onClick) {
      return (
        <button
          type="button"
          onClick={() => {
            item.onClick?.();
            setMobileOpen(false);
          }}
          className={className + " w-full text-left"}
        >
          <Icon className="h-5 w-5 shrink-0" />
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f59e0b] px-1.5 text-[11px] font-bold text-white">
              {item.badge}
            </span>
          )}
        </button>
      );
    }

    return (
      <Link
        href={item.href || "#"}
        onClick={() => setMobileOpen(false)}
        className={className}
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
  };

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
        style={{ width: collapsed ? 80 : 260, minWidth: collapsed ? 80 : 260 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7b61ff] to-[#9b85ff]">
            <Bot className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-base font-bold text-[#1a1b2e]">Erina.ai</p>
            </div>
          )}
        </div>

        {/* Nav groups */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
          {navGroups.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <p className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-widest text-[#9b94b0]">
                  {group.title}
                </p>
              )}
              {collapsed && <div className="my-2 border-t border-[#e5e2ee]" />}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink key={item.label} item={item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Toggle colapsar */}
        <div className="p-3">
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
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <p className="text-base font-bold text-[#1a1b2e]">Erina.ai</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#5c5870] hover:bg-[#f7f5ff]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav groups */}
            <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
              {navGroups.map((group) => (
                <div key={group.title}>
                  <p className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-widest text-[#9b94b0]">
                    {group.title}
                  </p>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <NavLink key={item.label} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </aside>
        </>
      )}
    </>
  );
}
