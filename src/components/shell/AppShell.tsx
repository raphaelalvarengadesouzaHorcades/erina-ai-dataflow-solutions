"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ErinaChat } from "@/components/erina/ErinaChat";
import { NudgeToaster } from "@/components/nudge/NudgeToaster";
import { NudgeProvider } from "@/components/providers/NudgeProvider";
import { PomodoroWidget } from "@/components/pomodoro";
import { useAuthStore } from "@/store/useAuthStore";
import { useJornadaStore } from "@/store/useJornadaStore";
import { createClient } from "@/lib/supabase/client";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const autenticado = useAuthStore((s) => s.autenticado);
  const usuario = useAuthStore((s) => s.usuario);
  const perfil = useAuthStore((s) => s.perfil);
  const hidratado = useAuthStore((s) => s.hidratado);
  const setUsuario = useAuthStore((s) => s.setUsuario);
  const setPerfil = useAuthStore((s) => s.setPerfil);

  // Rotas públicas sem shell/guarda: login, landing, callback, recuperar senha
  const publicRoutes = ["/login", "/", "/auth/callback", "/recuperar-senha", "/atualizar-senha"];
  const rotaPublica = publicRoutes.some((route) => pathname === route || pathname.startsWith(route));

  // Verificar sessão do Supabase no carregamento
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUsuario(session.user);
        
        // Buscar perfil
        const { data: perfilData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        if (perfilData) {
          setPerfil(perfilData);
        }
      }
    };

    if (hidratado) {
      checkSession();
    }
  }, [hidratado, setUsuario, setPerfil]);

  // Listener para mudanças de auth (login/logout em outras abas)
  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUsuario(session.user);
          const { data: perfilData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (perfilData) {
            setPerfil(perfilData);
          }
        } else if (event === "SIGNED_OUT") {
          setUsuario(null);
          setPerfil(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setUsuario, setPerfil]);

  // Semeia a jornada mock conforme o papel
  const emailSemeadoRef = useRef<string | null>(null);
  useEffect(() => {
    if (!hidratado || !autenticado || !perfil) return;
    if (emailSemeadoRef.current === perfil.id) return;
    emailSemeadoRef.current = perfil.id;
    useJornadaStore.getState().configurarPorPapel(perfil.role as "funcionario" | "gestor");
  }, [hidratado, autenticado, perfil]);

  useEffect(() => {
    if (!hidratado || rotaPublica) return;

    if (!autenticado) {
      router.replace("/login");
      return;
    }

    // Proteção de papel: colaborador não acessa painel do gestor
    if (
      perfil?.role === "colaborador" &&
      (pathname === "/gestor" || pathname.startsWith("/gestor/"))
    ) {
      router.replace("/dashboard");
    }
  }, [hidratado, rotaPublica, autenticado, perfil, pathname, router]);

  // Rotas públicas: sem shell nem guarda
  if (rotaPublica) {
    return <>{children}</>;
  }

  // Enquanto reidrata ou redireciona, evita flash de conteúdo protegido
  const colaboradorEmRotaGestor =
    perfil?.role === "colaborador" &&
    (pathname === "/gestor" || pathname.startsWith("/gestor/"));

  if (!hidratado || !autenticado || colaboradorEmRotaGestor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border-soft border-t-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-6 md:p-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>

      {/* Widgets globais do app */}
      <ErinaChat />
      <NudgeToaster />
      <NudgeProvider />
      <PomodoroWidget />
    </div>
  );
}
