"use client";

import { type ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ErinaChat } from "@/components/erina/ErinaChat";
import { NudgeToaster } from "@/components/nudge/NudgeToaster";
import { NudgeProvider } from "@/components/providers/NudgeProvider";
import { PomodoroWidget } from "@/components/pomodoro";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [carregando, setCarregando] = useState(true);
  const [sessaoVerificada, setSessaoVerificada] = useState(false);

  const autenticado = useAuthStore((s) => s.autenticado);
  const perfil = useAuthStore((s) => s.perfil);
  const setUsuario = useAuthStore((s) => s.setUsuario);
  const setPerfil = useAuthStore((s) => s.setPerfil);
  const setHidratado = useAuthStore((s) => s.setHidratado);

  // Rotas públicas — sem shell
  const publicRoutes = ["/login", "/", "/auth/callback", "/recuperar-senha", "/atualizar-senha"];
  const isPublic = publicRoutes.some((r) => pathname === r || pathname.startsWith(r));

  // Verifica sessão no mount
  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && !cancelled) {
          setUsuario(session.user);
          const { data: p } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (p) setPerfil(p);
        }
      } catch (e) {
        console.error("Erro ao verificar sessão:", e);
      } finally {
        if (!cancelled) {
          setSessaoVerificada(true);
          setCarregando(false);
          setHidratado(true);
        }
      }
    }
    check();
    return () => { cancelled = true; };
  }, [setUsuario, setPerfil, setHidratado]);

  // Auth state listener
  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUsuario(session.user);
          const { data: p } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (p) setPerfil(p);
        } else if (event === "SIGNED_OUT") {
          setUsuario(null);
          setPerfil(null);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [setUsuario, setPerfil]);

  // Redirecionamentos
  useEffect(() => {
    if (!sessaoVerificada || isPublic) return;
    if (!autenticado) {
      router.replace("/login");
    }
  }, [sessaoVerificada, isPublic, autenticado, router]);

  // Rotas públicas: renderiza só o children
  if (isPublic) {
    return <>{children}</>;
  }

  // Loading
  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5ff]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#e5e2ee] border-t-[#7b61ff]" />
          <p className="text-sm text-[#6b6780]">Carregando Erina...</p>
        </div>
      </div>
    );
  }

  // Não autenticado
  if (!autenticado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5ff]">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#e5e2ee] border-t-[#7b61ff]" />
      </div>
    );
  }

  // Layout autenticado
  return (
    <div className="flex min-h-screen bg-[#f7f5ff]">
      {/* Sidebar fixo à esquerda */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Widgets globais */}
      <ErinaChat />
      <NudgeToaster />
      <NudgeProvider />
      <PomodoroWidget />
    </div>
  );
}
