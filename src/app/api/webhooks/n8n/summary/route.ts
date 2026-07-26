import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/webhooks/n8n/summary
 * Webhook chamado pelo n8n para salvar o resumo gerado durante uma pausa
 * 
 * Payload esperado:
 * {
 *   user_id: string,
 *   pause_id: string,
 *   summary_text: string,
 *   demands_count: number,
 *   emails_count: number,
 *   messages_count: number,
 *   is_emergency: boolean,
 *   actions_taken: Array<{type: string, description: string}>
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      user_id,
      pause_id,
      summary_text,
      demands_count = 0,
      emails_count = 0,
      messages_count = 0,
      is_emergency = false,
      actions_taken = [],
    } = body;

    if (!user_id || !pause_id || !summary_text) {
      return NextResponse.json(
        { error: "Campos obrigatórios: user_id, pause_id, summary_text" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("pause_summaries")
      .insert({
        user_id,
        pause_id,
        summary_text,
        demands_count,
        emails_count,
        messages_count,
        is_emergency,
        actions_taken,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao salvar resumo:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Resumo salvo com sucesso",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
