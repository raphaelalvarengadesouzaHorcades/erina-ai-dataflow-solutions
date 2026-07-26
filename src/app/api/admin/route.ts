import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/tables
 * Lista todas as tabelas do schema public
 */
export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: tables, error } = await supabase.rpc("list_tables");

    if (error) {
      // Fallback: query direta no information_schema
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")
        .eq("table_type", "BASE TABLE");

      if (fallbackError) {
        return NextResponse.json(
          { error: fallbackError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ tables: fallbackData?.map((t) => t.table_name) || [] });
    }

    return NextResponse.json({ tables });
  } catch (err) {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/sync
 * Executa operações administrativas no banco
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, table, data, where } = body;

    const supabase = createAdminClient();

    switch (action) {
      case "insert": {
        const { data: result, error } = await supabase
          .from(table)
          .insert(data)
          .select();
        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ data: result });
      }

      case "update": {
        const { data: result, error } = await supabase
          .from(table)
          .update(data)
          .match(where)
          .select();
        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ data: result });
      }

      case "delete": {
        const { data: result, error } = await supabase
          .from(table)
          .delete()
          .match(where)
          .select();
        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ data: result });
      }

      case "query": {
        const { data: result, error } = await supabase
          .from(table)
          .select(data?.select || "*")
          .match(where || {});
        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ data: result });
      }

      default:
        return NextResponse.json(
          { error: "Ação não suportada. Use: insert, update, delete, query" },
          { status: 400 }
        );
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
