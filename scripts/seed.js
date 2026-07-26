#!/usr/bin/env node
/**
 * Script para popular o banco com dados de teste
 * 
 * Uso: node scripts/seed.js
 */

const { createClient } = require("@supabase/supabase-js");

require("dotenv").config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Variáveis de ambiente não configuradas!");
  process.exit(1);
}

async function seed() {
  console.log("🌱 Populando banco com dados de teste...\n");

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    // Criar empresa
    const { data: company, error: companyError } = await supabase
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

    if (companyError) {
      console.log("🏢 Empresa já existe ou erro:", companyError.message);
    } else {
      console.log("✅ Empresa criada:", company.name);
    }

    // Criar documentação da API
    const { data: existingDocs } = await supabase
      .from("api_documentation")
      .select("id")
      .limit(1);

    if (!existingDocs || existingDocs.length === 0) {
      const docs = [
        {
          title: "Listar Demandas",
          endpoint: "/api/demands",
          method: "GET",
          description: "Retorna todas as demandas do colaborador",
          category: "Demandas",
          is_public: true,
        },
        {
          title: "Webhook - Pausa",
          endpoint: "/api/webhooks/n8n/pause",
          method: "POST",
          description: "Registra início de pausa",
          category: "Webhooks",
          is_public: true,
        },
        {
          title: "Webhook - Resumo",
          endpoint: "/api/webhooks/n8n/summary",
          method: "POST",
          description: "Salva resumo da IA",
          category: "Webhooks",
          is_public: true,
        },
      ];

      const { error: docsError } = await supabase.from("api_documentation").insert(docs);
      if (!docsError) {
        console.log("✅ Documentação da API criada!");
      }
    }

    console.log("\n✅ Seed concluído!");

  } catch (err) {
    console.error("❌ Erro:", err);
    process.exit(1);
  }
}

seed();
