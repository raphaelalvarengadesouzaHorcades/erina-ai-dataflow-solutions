import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/webhooks/n8n/demand
 * Webhook chamado pelo n8n para criar uma nova demanda
 * 
 * Payload esperado:
 * {
 *   user_id: string,
 *   title: string,
 *   source: string,
 *   source_type: 'email' | 'whatsapp' | 'slack' | 'teams',
 *   priority: 'low' | 'medium' | 'high' | 'urgent',
 *   external_id: string (opcional)
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      user_id,
      title,
      source,
      source_type,
      priority = "medium",
      external_id,
    } = body;

    if (!user_id || !title || !source) {
      return NextResponse.json(
        { error: "Campos obrigatórios: user_id, title, source" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("demands")
      .insert({
        user_id,
        title,
        source,
        source_type,
        priority,
        external_id,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar demanda:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Demanda criada com sucesso",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
