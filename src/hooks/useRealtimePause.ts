"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { usePausaStore } from "@/store/usePausaStore";

/**
 * Hook para escutar atualizações em tempo real do Supabase Realtime.
 * Use no AppShell ou no Dashboard para receber resumos da IA automaticamente.
 */
export function useRealtimePause(userId: string | null | undefined) {
  const buscarResumo = usePausaStore((s) => s.buscarResumo);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();

    // Canal para atualizações na tabela pause_summaries
    const channel = supabase
      .channel(`pause-summaries-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "pause_summaries",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("📨 Novo resumo recebido da IA:", payload);
          const summary = payload.new;
          // Atualizar o store com o novo resumo
          usePausaStore.setState({ resumoAtual: summary });
        }
      )
      .subscribe((status) => {
        console.log("🔌 Realtime status:", status);
      });

    subscriptionRef.current = channel;

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, [userId, buscarResumo]);
}
