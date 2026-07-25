"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const loginComOAuth = useAuthStore((s) => s.loginComOAuth);
  const carregando = useAuthStore((s) => s.carregando);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [modoRecuperar, setModoRecuperar] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setMensagem(null);

    if (modoRecuperar) {
      const res = await useAuthStore.getState().recuperarSenha(email);
      if (res.ok) {
        setMensagem("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
        setModoRecuperar(false);
      } else {
        setErro(res.erro ?? "Erro ao enviar e-mail de recuperação.");
      }
      return;
    }

    const res = await login(email, senha);
    if (!res.ok) {
      setErro(res.erro ?? "Não foi possível entrar.");
      return;
    }

    const perfil = useAuthStore.getState().perfil;
    router.push(perfil?.role === "gestor" ? "/gestor" : "/dashboard");
  }

  async function handleOAuth(provider: "google" | "microsoft") {
    setErro(null);
    const res = await loginComOAuth(provider);
    if (!res.ok) {
      setErro(res.erro ?? "Erro ao conectar.");
    }
  }

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[1.25fr_1fr] xl:grid-cols-[1.4fr_1fr]">
      {/* Coluna esquerda — marca */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#7b61ff] to-[#5a3de0] p-10 text-white lg:flex">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Erina</span>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">
            Seu bem-estar em primeiro lugar
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-md">
            Uma IA que cuida de você enquanto você cuida do que importa. 
            Sem invasão, sem pressão — só apoio inteligente.
          </p>
        </div>

        <div className="relative z-10 text-sm text-white/60">
          © {new Date().getFullYear()} Erina. Todos os direitos reservados.
        </div>

        {/* Padrão decorativo */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')]" />
      </div>

      {/* Coluna direita — formulário */}
      <main className="flex items-center justify-center bg-white px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          {/* Cabeçalho da marca — só no mobile */}
          <div className="mb-8 flex justify-center lg:hidden">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7b61ff] to-[#9b85ff] flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#1a1b2e]">Erina</span>
            </div>
          </div>

          <div className="mb-7">
            <h2 className="text-3xl font-bold tracking-tight text-[#1E1B4B]">
              {modoRecuperar ? "Recuperar senha" : "Bem-vindo(a) de volta!"} 💜
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[#6B7280]">
              {modoRecuperar
                ? "Digite seu e-mail para receber instruções de recuperação."
                : "Entre com suas credenciais para acessar o portal Erina."}
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
                  required
                  className="w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFE] py-3 pl-11 pr-3.5 text-sm text-[#111827] outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#7B61FF] focus:bg-white focus:ring-4 focus:ring-[#7B61FF]/12"
                />
              </div>
            </div>

            {/* Senha — só no modo login */}
            {!modoRecuperar && (
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
                    onClick={() => {
                      setModoRecuperar(true);
                      setErro(null);
                      setMensagem(null);
                    }}
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
                    required
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
            )}

            {/* Mensagens */}
            {erro && (
              <p className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-3.5 py-2.5 text-sm font-medium text-[#DC2626]">
                {erro}
              </p>
            )}
            {mensagem && (
              <p className="rounded-xl border border-green-200 bg-green-50 px-3.5 py-2.5 text-sm font-medium text-green-700">
                {mensagem}
              </p>
            )}

            {/* Botão principal */}
            <button
              type="submit"
              disabled={carregando}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#A78BFA] to-[#7B61FF] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#7B61FF]/30 transition-all hover:shadow-xl hover:shadow-[#7B61FF]/40 hover:brightness-105 active:scale-[0.99]",
                carregando && "cursor-not-allowed opacity-70"
              )}
            >
              {carregando
                ? "Processando…"
                : modoRecuperar
                ? "Enviar instruções"
                : "Entrar"}
              {!carregando && <ArrowRight className="h-4 w-4" />}
            </button>

            {/* Voltar para login */}
            {modoRecuperar && (
              <button
                type="button"
                onClick={() => {
                  setModoRecuperar(false);
                  setErro(null);
                  setMensagem(null);
                }}
                className="w-full text-center text-sm text-[#7B61FF] font-semibold hover:text-[#6A4BF5]"
              >
                Voltar para o login
              </button>
            )}
          </form>

          {/* Divider */}
          {!modoRecuperar && (
            <div className="mt-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-[#E5E7EB]" />
              <span className="text-xs text-[#9CA3AF] font-medium">ou</span>
              <div className="flex-1 h-px bg-[#E5E7EB]" />
            </div>
          )}

          {/* OAuth buttons */}
          {!modoRecuperar && (
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => handleOAuth("google")}
                disabled={carregando}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#E5E7EB] bg-white py-3 text-sm font-semibold text-[#374151] transition-all hover:bg-[#FAFAFE] hover:border-[#7B61FF]/30 disabled:opacity-60"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Entrar com Google
              </button>

              <button
                type="button"
                onClick={() => handleOAuth("microsoft")}
                disabled={carregando}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#E5E7EB] bg-white py-3 text-sm font-semibold text-[#374151] transition-all hover:bg-[#FAFAFE] hover:border-[#7B61FF]/30 disabled:opacity-60"
              >
                <svg className="w-5 h-5" viewBox="0 0 21 21">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                </svg>
                Entrar com Microsoft
              </button>
            </div>
          )}

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
