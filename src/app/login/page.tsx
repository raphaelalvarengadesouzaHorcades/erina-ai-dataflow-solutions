"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore, SENHA_DEMO } from "@/store/useAuthStore";
import { BrandPanel } from "@/components/login/BrandPanel";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  function irParaApp(role: "funcionario" | "gestor") {
    router.push(role === "gestor" ? "/gestor" : "/dashboard");
  }

  function autenticar(emailUse: string, senhaUse: string) {
    setErro(null);
    setCarregando(true);
    const res = login(emailUse, senhaUse);
    if (!res.ok) {
      setErro(res.erro ?? "Não foi possível entrar.");
      setCarregando(false);
      return;
    }
    const usuario = useAuthStore.getState().usuario;
    irParaApp(usuario?.role ?? "funcionario");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    autenticar(email, senha);
  }

  function entrarComoDemo(demoEmail: string) {
    setEmail(demoEmail);
    setSenha(SENHA_DEMO);
    autenticar(demoEmail, SENHA_DEMO);
  }

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[1.25fr_1fr] xl:grid-cols-[1.4fr_1fr]">
      {/* Coluna esquerda — marca (escondida no mobile) */}
      <BrandPanel />

      {/* Coluna direita — formulário */}
      <main className="flex items-center justify-center bg-white px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          {/* Cabeçalho da marca — só no mobile */}
          <div className="mb-8 flex justify-center lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/erina-logo.png" alt="ERINA.IA" className="h-10 w-auto" />
          </div>

          <div className="mb-7">
            <h2 className="text-3xl font-bold tracking-tight text-[#1E1B4B]">
              Bem-vindo(a) de volta! <span aria-hidden>💜</span>
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[#6B7280]">
              Entre com suas credenciais para acessar a plataforma ERINA.IA.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            {/* E-mail */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-[#374151]"
              >
                E-mail
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFE] py-3 pl-11 pr-3.5 text-sm text-[#111827] outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#7B61FF] focus:bg-white focus:ring-4 focus:ring-[#7B61FF]/12"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="senha"
                  className="block text-sm font-semibold text-[#374151]"
                >
                  Senha
                </label>
                <button
                  type="button"
                  className="text-sm font-semibold text-[#7B61FF] transition-colors hover:text-[#6A4BF5]"
                >
                  Esqueceu sua senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFE] py-3 pl-11 pr-11 text-sm text-[#111827] outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#7B61FF] focus:bg-white focus:ring-4 focus:ring-[#7B61FF]/12"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#9CA3AF] transition-colors hover:bg-[#EEF0FF] hover:text-[#7B61FF]"
                >
                  {mostrarSenha ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" />
                  )}
                </button>
              </div>
            </div>

            {/* Lembrar de mim */}
            <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-[#4B5563]">
              <input
                type="checkbox"
                checked={lembrar}
                onChange={(e) => setLembrar(e.target.checked)}
                className="h-4 w-4 rounded border-[#D1D5DB] text-[#7B61FF] accent-[#7B61FF] focus:ring-[#7B61FF]/30"
              />
              Lembrar de mim
            </label>

            {/* Mensagem de erro */}
            {erro && (
              <p className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-3.5 py-2.5 text-sm font-medium text-[#DC2626]">
                {erro}
              </p>
            )}

            {/* Entrar */}
            <button
              type="submit"
              disabled={carregando}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#A78BFA] to-[#7B61FF] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#7B61FF]/30 transition-all hover:shadow-xl hover:shadow-[#7B61FF]/40 hover:brightness-105 active:scale-[0.99]",
                carregando && "cursor-not-allowed opacity-70"
              )}
            >
              {carregando ? "Entrando…" : "Entrar"}
              {!carregando && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Acesso demo (discreto) */}
          <div className="mt-7 rounded-2xl border border-[#EEF0FF] bg-[#FAFAFE] p-4">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
              Acesso rápido (demo)
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => entrarComoDemo("mariana@demo.com")}
                disabled={carregando}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-xs font-semibold text-[#4B5563] transition-colors hover:border-[#7B61FF] hover:bg-[#EEF0FF] hover:text-[#7B61FF] disabled:opacity-60"
              >
                <User className="h-4 w-4 shrink-0" />
                Funcionária (Mariana)
              </button>
              <button
                type="button"
                onClick={() => entrarComoDemo("gestor@demo.com")}
                disabled={carregando}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-xs font-semibold text-[#4B5563] transition-colors hover:border-[#7B61FF] hover:bg-[#EEF0FF] hover:text-[#7B61FF] disabled:opacity-60"
              >
                <ShieldCheck className="h-4 w-4 shrink-0" />
                Gestor (Rafael)
              </button>
            </div>
            <p className="mt-3 text-center text-[11px] text-[#B6BAC5]">
              senha demo:{" "}
              <code className="font-mono text-[#9CA3AF]">{SENHA_DEMO}</code>
            </p>
          </div>

          {/* Rodapé */}
          <p className="mt-8 text-center text-sm text-[#6B7280]">
            Ainda não tem uma conta?{" "}
            <span className="font-semibold text-[#7B61FF]">
              Fale com o administrador.
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
