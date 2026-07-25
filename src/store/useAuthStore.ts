import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

/* ------------------------------------------------------------------ */
/* Tipos públicos                                                      */
/* ------------------------------------------------------------------ */

export type Papel = "colaborador" | "gestor" | "admin";

export interface PerfilUsuario {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  cargo: string | null;
  role: Papel;
  department: string | null;
  phone: string | null;
  notification_preferences: Record<string, boolean>;
}

export interface AuthState {
  /* --- estado --- */
  usuario: User | null;
  perfil: PerfilUsuario | null;
  autenticado: boolean;
  carregando: boolean;
  hidratado: boolean;

  /* --- ações --- */
  login: (email: string, senha: string) => Promise<{ ok: boolean; erro?: string }>;
  loginComOAuth: (provider: "google" | "microsoft") => Promise<{ ok: boolean; erro?: string }>;
  logout: () => Promise<void>;
  cadastrar: (dados: {
    email: string;
    senha: string;
    nome: string;
    cargo: string;
  }) => Promise<{ ok: boolean; erro?: string }>;
  recuperarSenha: (email: string) => Promise<{ ok: boolean; erro?: string }>;
  atualizarPerfil: (dados: Partial<PerfilUsuario>) => Promise<{ ok: boolean; erro?: string }>;
  setUsuario: (usuario: User | null) => void;
  setPerfil: (perfil: PerfilUsuario | null) => void;
  setHidratado: (v: boolean) => void;
  setCarregando: (v: boolean) => void;
}

/* ------------------------------------------------------------------ */
/* Store com Supabase Auth                                             */
/* ------------------------------------------------------------------ */

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      /* --- estado inicial --- */
      usuario: null,
      perfil: null,
      autenticado: false,
      carregando: false,
      hidratado: false,

      /* --- ações --- */
      login: async (email, senha) => {
        set({ carregando: true });
        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password: senha,
          });

          if (error) {
            return { ok: false, erro: error.message };
          }

          if (data.user) {
            // Buscar perfil do usuário
            const { data: perfilData } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", data.user.id)
              .single();

            set({
              usuario: data.user,
              perfil: perfilData as PerfilUsuario | null,
              autenticado: true,
            });
            return { ok: true };
          }

          return { ok: false, erro: "Erro desconhecido ao fazer login." };
        } catch (err) {
          return { ok: false, erro: "Erro de conexão. Tente novamente." };
        } finally {
          set({ carregando: false });
        }
      },

      loginComOAuth: async (provider) => {
        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) {
            return { ok: false, erro: error.message };
          }

          return { ok: true };
        } catch (err) {
          return { ok: false, erro: "Erro de conexão. Tente novamente." };
        }
      },

      logout: async () => {
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
        } finally {
          set({ usuario: null, perfil: null, autenticado: false });
        }
      },

      cadastrar: async ({ email, senha, nome, cargo }) => {
        set({ carregando: true });
        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password: senha,
            options: {
              data: {
                full_name: nome.trim(),
                cargo: cargo.trim(),
              },
            },
          });

          if (error) {
            return { ok: false, erro: error.message };
          }

          if (data.user) {
            // O trigger do Supabase já criou o perfil, vamos atualizar
            const { error: updateError } = await supabase
              .from("profiles")
              .update({
                full_name: nome.trim(),
                cargo: cargo.trim(),
                role: "colaborador",
              })
              .eq("id", data.user.id);

            if (updateError) {
              console.error("Erro ao atualizar perfil:", updateError);
            }

            return { ok: true };
          }

          return { ok: false, erro: "Erro desconhecido ao criar conta." };
        } catch (err) {
          return { ok: false, erro: "Erro de conexão. Tente novamente." };
        } finally {
          set({ carregando: false });
        }
      },

      recuperarSenha: async (email) => {
        try {
          const supabase = createClient();
          const { error } = await supabase.auth.resetPasswordForEmail(
            email.trim().toLowerCase(),
            {
              redirectTo: `${window.location.origin}/atualizar-senha`,
            }
          );

          if (error) {
            return { ok: false, erro: error.message };
          }

          return { ok: true };
        } catch (err) {
          return { ok: false, erro: "Erro de conexão. Tente novamente." };
        }
      },

      atualizarPerfil: async (dados) => {
        try {
          const supabase = createClient();
          const { usuario } = get();
          if (!usuario) {
            return { ok: false, erro: "Usuário não autenticado." };
          }

          const { error } = await supabase
            .from("profiles")
            .update(dados)
            .eq("id", usuario.id);

          if (error) {
            return { ok: false, erro: error.message };
          }

          // Atualizar estado local
          set((state) => ({
            perfil: state.perfil ? { ...state.perfil, ...dados } : null,
          }));

          return { ok: true };
        } catch (err) {
          return { ok: false, erro: "Erro de conexão. Tente novamente." };
        }
      },

      setUsuario: (usuario) => set({ usuario, autenticado: !!usuario }),
      setPerfil: (perfil) => set({ perfil }),
      setHidratado: (v) => set({ hidratado: v }),
      setCarregando: (v) => set({ carregando: v }),
    }),
    {
      name: "erina-auth",
      partialize: (s) => ({
        usuario: s.usuario,
        perfil: s.perfil,
        autenticado: s.autenticado,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHidratado(true);
      },
    }
  )
);
