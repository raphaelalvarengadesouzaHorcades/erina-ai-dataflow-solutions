#!/usr/bin/env node
/**
 * Script para sincronizar dados do banco com o projeto
 * 
 * Uso: node scripts/sync-db.js
 */

const { createClient } = require("@supabase/supabase-js");

require("dotenv").config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Variáveis de ambiente não configuradas!");
  process.exit(1);
}

const REQUIRED_TABLES = [
  "profiles",
  "work_sessions",
  "pauses",
  "demands",
  "chat_messages",
  "user_connections",
  "emails",
  "whatsapp_messages",
  "pause_summaries",
  "api_documentation",
  "companies",
  "company_members",
];

async function syncDatabase() {
  console.log("🔄 Sincronizando banco de dados...\n");

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    // Verificar tabelas existentes através de consulta RPC
    const { data: tablesData, error: tablesError } = await supabase.rpc(
      "get_tables"
    );

    let existingTableNames = [];
    
    if (tablesError) {
      // Fallback: tentar listar tabelas via query direta
      console.log("⚠️ RPC não disponível, usando fallback...");
      
      // Verificar cada tabela individualmente
      for (const table of REQUIRED_TABLES) {
        const { error } = await supabase
          .from(table)
          .select("count", { count: "exact", head: true });
        
        if (!error) {
          existingTableNames.push(table);
        }
      }
    } else {
      existingTableNames = tablesData || [];
    }

    const missingTables = REQUIRED_TABLES.filter(
      (t) => !existingTableNames.includes(t)
    );

    if (missingTables.length > 0) {
      console.warn("⚠️ Tabelas ausentes:");
      missingTables.forEach((t) => console.warn(`   • ${t}`));
      console.log("\n📋 Execute as migrations SQL no Dashboard do Supabase.");
    } else {
      console.log("✅ Todas as tabelas necessárias existem!");
    }

    // Contar registros em cada tabela
    console.log("\n📊 Contagem de registros:");
    for (const table of existingTableNames) {
      const { count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });

      if (error) {
        console.log(`   • ${table}: Erro ao contar`);
      } else {
        console.log(`   • ${table}: ${count || 0} registros`);
      }
    }

    // Verificar empresa
    const { data: companies } = await supabase
      .from("companies")
      .select("*")
      .limit(1);

    if (!companies || companies.length === 0) {
      console.log("\n🏢 Criando empresa padrão...");
      
      const { data: newCompany, error: createError } = await supabase
        .from("companies")
        .insert({
          name: "Empresa Demo",
          slug: "empresa-demo",
          primary_color: "#7b61ff",
          settings: {
            timezone: "America/Sao_Paulo",
            work_hours: { start: "09:00", end: "18:00" },
          },
        })
        .select()
        .single();

      if (createError) {
        console.error("❌ Erro:", createError.message);
      } else {
        console.log("✅ Empresa criada:", newCompany.name);
      }
    }

    console.log("\n✅ Sincronização concluída!");

  } catch (err) {
    console.error("❌ Erro:", err);
    process.exit(1);
  }
}

syncDatabase();
