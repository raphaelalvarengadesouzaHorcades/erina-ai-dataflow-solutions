import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/webhooks/n8n/pause
 * Webhook chamado pelo n8n quando um colaborador inicia uma pausa
 * 
 * Payload esperado:
 * {
 *   user_id: string,
 *   pause_id: string,
 *   type: 'intervalo' | 'emergencia',
 *   timestamp: string
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, pause_id, type, timestamp } = body;

    if (!user_id || !pause_id || !type) {
      return NextResponse.json(
        { error: "Campos obrigatórios: user_id, pause_id, type" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Registrar log do webhook
    const { error: logError } = await supabase
      .from("pause_summaries")
      .insert({
        user_id,
        pause_id,
        summary_text: `Pausa iniciada: ${type}`,
        is_emergency: type === "emergencia",
      });

    if (logError) {
      console.error("Erro ao registrar pausa:", logError);
      return NextResponse.json(
        { error: logError.message },
        { status: 500 }
      );
    }

    // Aqui você pode adicionar mais lógica:
    // - Notificar outros sistemas
    // - Disparar eventos
    // - Escalonar para gestor em caso de emergência

    return NextResponse.json({
      success: true,
      message: `Pausa ${type} registrada para o usuário ${user_id}`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
