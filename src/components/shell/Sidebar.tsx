"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Clock,
  Calendar,
  LayoutGrid,
  Inbox,
  BarChart3,
  Bell,
  Settings,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Trophy,
  Medal,
  Users,
  LogOut,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useJornadaStore } from "@/store/useJornadaStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useUiStore } from "@/store/useUiStore";
import { useEffect } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  /** Se definido, só aparece para este papel. */
  somenteRole?: "funcionario" | "gestor";
}

const NAV_ITENS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/mensagens", label: "Mensagens", icon: Inbox },
  { href: "/calendario", label: "Calendário", icon: Calendar },
  { href: "/tarefas", label: "Tarefas", icon: LayoutGrid },
  { href: "/ranking", label: "Ranking", icon: Medal },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/alertas", label: "Lembretes & Resumos", icon: Bell, badge: "3" },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

// Frentes do desafio Hack e Ética — a solução da Erina.
const NAV_FRENTES: NavItem[] = [
  { href: "/transparencia", label: "Transparência", icon: ShieldCheck },
  { href: "/minha-saude", label: "Minha Saúde", icon: Trophy },
  {
    href: "/gestor",
    label: "Painel do Gestor",
    icon: Users,
    somenteRole: "gestor",
  },
];

function NavLink({
  item,
  pathname,
  colapsada,
  onClick,
}: {
  item: NavItem;
  pathname: string;
  colapsada: boolean;
  onClick?: () => void;
}) {
  const ativo =
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icone = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={colapsada ? item.label : undefined}
      aria-label={colapsada ? item.label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-colors",
        colapsada ? "justify-center px-0" : "px-3",
        ativo
          ? "bg-primary text-white"
          : "text-muted hover:bg-primary-light hover:text-primary"
      )}
    >
      <Icone className="h-5 w-5 shrink-0" />
      {!colapsada && (
        <span className="flex-1 truncate">{item.label}</span>
      )}
      {!colapsada && item.badge && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-warning px-1.5 text-xs font-semibold text-white">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const perfil = useAuthStore((s) => s.perfil);
  const role = perfil?.role;
  const logout = useAuthStore((s) => s.logout);

  const sidebarColapsada = useUiStore((s) => s.sidebarColapsada);
  const sidebarMobileAberto = useUiStore((s) => s.sidebarMobileAberto);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const toggleSidebarMobile = useUiStore((s) => s.toggleSidebarMobile);
  const fecharSidebarMobile = useUiStore((s) => s.fecharSidebarMobile);
  const hidratado = useUiStore((s) => s.hidratado);
  // Só aplica o modo rail depois da reidratação, evitando mismatch de SSR.
  const colapsada = hidratado && sidebarColapsada;

  function sair() {
    logout();
    router.replace("/login");
  }

  const frentesVisiveis = NAV_FRENTES.filter(
    (item) => !item.somenteRole || item.somenteRole === role
  );

  // Fecha o menu mobile ao pressionar Escape
  useEffect(() => {
    if (!sidebarMobileAberto) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") fecharSidebarMobile();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sidebarMobileAberto, fecharSidebarMobile]);

  // Trava o scroll do body quando o menu mobile está aberto
  useEffect(() => {
    if (sidebarMobileAberto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarMobileAberto]);

  return (
    <>
      {/* ============================================ */}
      {/* SIDEBAR DESKTOP — sempre visível em md+       */}
      {/* ============================================ */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border-soft bg-card transition-[width] duration-300 ease-in-out md:flex",
          colapsada ? "w-[72px]" : "w-[260px]"
        )}
      >
        {/* Marca */}
        <div
          className={cn(
            "flex items-center gap-3 py-6",
            colapsada ? "justify-center px-0" : "px-5"
          )}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-2 ring-primary">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          {!colapsada && (
            <div className="leading-tight">
              <p className="text-sm font-bold text-ink">Controle</p>
              <p className="text-sm font-bold text-ink">de Jornada</p>
            </div>
          )}
        </div>

        {/* Navegação */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {NAV_ITENS.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              colapsada={colapsada}
            />
          ))}

          {/* Grupo: a solução ética (frentes do desafio) */}
          {colapsada ? (
            <div className="my-2 border-t border-border-soft" />
          ) : (
            <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-muted">
              Solução Ética
            </p>
          )}
          {frentesVisiveis.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              colapsada={colapsada}
            />
          ))}
        </nav>

        {/* Rodapé: card da Erina + sair */}
        <div className="space-y-2 p-3">
          <button
            type="button"
            onClick={() => useJornadaStore.getState().abrirChat()}
            title={colapsada ? "Erina — Assistente de IA" : undefined}
            aria-label={colapsada ? "Erina — Assistente de IA" : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl bg-primary-light py-3 text-left transition-colors hover:bg-primary/10",
              colapsada ? "justify-center px-0" : "px-3"
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            {!colapsada && (
              <>
                <div className="flex-1 leading-tight">
                  <p className="text-sm font-bold text-ink">Erina</p>
                  <p className="text-xs text-muted">Assistente de IA</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={sair}
            title={colapsada ? "Sair" : undefined}
            aria-label={colapsada ? "Sair" : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl py-2 text-sm font-medium text-muted transition-colors hover:bg-danger/10 hover:text-danger",
              colapsada ? "justify-center px-0" : "px-3"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!colapsada && <span className="flex-1 text-left">Sair</span>}
          </button>
        </div>
      </aside>

      {/* ============================================ */}
      {/* DRAWER MOBILE — overlay em telas < md         */}
      {/* ============================================ */}
      {sidebarMobileAberto && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={fecharSidebarMobile}
            aria-hidden="true"
          />
          {/* Painel */}
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-border-soft bg-card shadow-2xl md:hidden">
            {/* Header do drawer */}
            <div className="flex items-center justify-between px-5 py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-2 ring-primary">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-ink">Controle</p>
                  <p className="text-sm font-bold text-ink">de Jornada</p>
                </div>
              </div>
              <button
                type="button"
                onClick={fecharSidebarMobile}
                aria-label="Fechar menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-primary-light hover:text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navegação */}
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
              {NAV_ITENS.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  colapsada={false}
                  onClick={fecharSidebarMobile}
                />
              ))}

              <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-muted">
                Solução Ética
              </p>
              {frentesVisiveis.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  colapsada={false}
                  onClick={fecharSidebarMobile}
                />
              ))}
            </nav>

            {/* Rodapé */}
            <div className="space-y-2 p-3">
              <button
                type="button"
                onClick={() => {
                  fecharSidebarMobile();
                  useJornadaStore.getState().abrirChat();
                }}
                className="flex w-full items-center gap-3 rounded-xl bg-primary-light px-3 py-3 text-left transition-colors hover:bg-primary/10"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 leading-tight">
                  <p className="text-sm font-bold text-ink">Erina</p>
                  <p className="text-xs text-muted">Assistente de IA</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
              </button>

              <button
                type="button"
                onClick={() => {
                  fecharSidebarMobile();
                  sair();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-danger/10 hover:text-danger"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span className="flex-1 text-left">Sair</span>
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
