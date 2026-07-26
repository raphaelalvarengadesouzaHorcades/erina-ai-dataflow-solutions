import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export type TipoPausa = "normal" | "intervalo" | "emergencia";

export interface PausaSupabase {
  id: string;
  session_id: string | null;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  type: TipoPausa;
  is_emergency: boolean;
}

export interface PauseSummary {
  id: string;
  summary_text: string;
  demands_count: number;
  emails_count: number;
  messages_count: number;
  is_emergency: boolean;
  actions_taken: any[];
  generated_at: string;
}

export interface PausaState {
  pausaAtual: PausaSupabase | null;
  historico: PausaSupabase[];
  resumoAtual: PauseSummary | null;
  carregando: boolean;
  erro: string | null;

  iniciarPausa: (userId: string, tipo: TipoPausa) => Promise<{ ok: boolean; erro?: string; data?: PausaSupabase }>;
  encerrarPausa: (userId: string) => Promise<{ ok: boolean; erro?: string; data?: PausaSupabase }>;
  buscarResumo: (pauseId: string) => Promise<{ ok: boolean; data?: PauseSummary }>;
  carregarHistorico: (userId: string) => Promise<void>;
}

export const usePausaStore = create<PausaState>((set, get) => ({
  pausaAtual: null,
  historico: [],
  resumoAtual: null,
  carregando: false,
  erro: null,

  iniciarPausa: async (userId, tipo) => {
    set({ carregando: true, erro: null });
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("pauses")
        .insert({
          user_id: userId,
          type: tipo,
          is_emergency: tipo === "emergencia",
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        set({ erro: error.message, carregando: false });
        return { ok: false, erro: error.message };
      }

      set({ pausaAtual: data as PausaSupabase, carregando: false });
      return { ok: true, data: data as PausaSupabase };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao iniciar pausa";
      set({ erro: msg, carregando: false });
      return { ok: false, erro: msg };
    }
  },

  encerrarPausa: async (userId) => {
    const { pausaAtual } = get();
    if (!pausaAtual) {
      return { ok: false, erro: "Nenhuma pausa em andamento" };
    }

    set({ carregando: true, erro: null });
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("pauses")
        .update({ ended_at: new Date().toISOString() })
        .eq("id", pausaAtual.id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        set({ erro: error.message, carregando: false });
        return { ok: false, erro: error.message };
      }

      // Buscar resumo se houver
      const { data: resumo } = await supabase
        .from("pause_summaries")
        .select("*")
        .eq("pause_id", pausaAtual.id)
        .order("generated_at", { ascending: false })
        .limit(1)
        .single();

      set({
        pausaAtual: null,
        resumoAtual: resumo ? (resumo as PauseSummary) : null,
        carregando: false,
      });

      return { ok: true, data: data as PausaSupabase };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao encerrar pausa";
      set({ erro: msg, carregando: false });
      return { ok: false, erro: msg };
    }
  },

  buscarResumo: async (pauseId) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("pause_summaries")
        .select("*")
        .eq("pause_id", pauseId)
        .order("generated_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        return { ok: false };
      }

      set({ resumoAtual: data as PauseSummary });
      return { ok: true, data: data as PauseSummary };
    } catch {
      return { ok: false };
    }
  },

  carregarHistorico: async (userId) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("pauses")
        .select("*")
        .eq("user_id", userId)
        .order("started_at", { ascending: false })
        .limit(50);

      if (!error && data) {
        set({ historico: data as PausaSupabase[] });
      }
    } catch {
      // Silencioso
    }
  },
}));
