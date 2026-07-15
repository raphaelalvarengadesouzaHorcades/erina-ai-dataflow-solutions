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

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const autenticado = useAuthStore((s) => s.autenticado);
  const usuario = useAuthStore((s) => s.usuario);
  const hidratado = useAuthStore((s) => s.hidratado);

  // Rotas públicas sem shell/guarda: login e a landing page ("/").
  const naTelaLogin = pathname === "/login";
  const naLanding = pathname === "/";
  const rotaPublica = naTelaLogin || naLanding;

  // Semeia a jornada mock conforme o papel — só quando o usuário logado muda
  // (guarda o último email semeado para não re-semear/resetar a cada render).
  const emailSemeadoRef = useRef<string | null>(null);
  useEffect(() => {
    if (!hidratado || !autenticado || !usuario) return;
    if (emailSemeadoRef.current === usuario.email) return;
    emailSemeadoRef.current = usuario.email;
    useJornadaStore.getState().configurarPorPapel(usuario.role);
  }, [hidratado, autenticado, usuario]);

  useEffect(() => {
    // Aguarda a reidratação do localStorage antes de decidir redirecionar.
    if (!hidratado || rotaPublica) return;

    // Não autenticado → manda para o login.
    if (!autenticado) {
      router.replace("/login");
      return;
    }

    // Proteção de papel: funcionário não acessa o painel do gestor.
    if (
      usuario?.role === "funcionario" &&
      (pathname === "/gestor" || pathname.startsWith("/gestor/"))
    ) {
      router.replace("/dashboard");
    }
  }, [hidratado, rotaPublica, autenticado, usuario, pathname, router]);

  // Rotas públicas (login e landing): sem shell nem guarda.
  if (rotaPublica) {
    return <>{children}</>;
  }

  // Enquanto reidrata ou redireciona, evita flash de conteúdo protegido.
  const funcionarioEmRotaGestor =
    usuario?.role === "funcionario" &&
    (pathname === "/gestor" || pathname.startsWith("/gestor/"));

  if (!hidratado || !autenticado || funcionarioEmRotaGestor) {
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

      {/* Widgets globais do app — só nas rotas autenticadas (nunca na landing/login) */}
      <ErinaChat />
      <NudgeToaster />
      <NudgeProvider />
      <PomodoroWidget />
    </div>
  );
}
