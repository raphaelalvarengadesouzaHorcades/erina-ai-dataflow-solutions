#!/usr/bin/env node
/**
 * Script para gerar tipos TypeScript das tabelas do Supabase
 * 
 * Uso: node scripts/generate-types.js
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Variáveis de ambiente não configuradas!");
  process.exit(1);
}

const TABLES = [
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

async function generateTypes() {
  console.log("🔄 Gerando tipos do Supabase...\n");

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const schema = {};

  try {
    for (const tableName of TABLES) {
      // Buscar um registro de exemplo para inferir os tipos
      const { data: sample, error } = await supabase
        .from(tableName)
        .select("*")
        .limit(1);

      if (error) {
        console.warn(`⚠️ Erro ao buscar ${tableName}:`, error.message);
        continue;
      }

      if (sample && sample.length > 0) {
        schema[tableName] = inferTypes(sample[0]);
      } else {
        // Tabela vazia - usar estrutura padrão
        schema[tableName] = getDefaultSchema(tableName);
      }
    }

    // Gerar arquivo de tipos
    const typesPath = path.join(process.cwd(), "src", "types", "supabase.ts");
    
    const typesDir = path.dirname(typesPath);
    if (!fs.existsSync(typesDir)) {
      fs.mkdirSync(typesDir, { recursive: true });
    }

    const typeDefinitions = Object.entries(schema)
      .map(([tableName, fields]) => {
        const interfaceName = tableName
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join("") + "Row";

        const fieldsStr = Object.entries(fields)
          .map(([fieldName, fieldType]) => {
            const nullable = fieldName !== "id" ? " | null" : "";
            return `    ${fieldName}: ${fieldType}${nullable};`;
          })
          .join("\n");

        return `export interface ${interfaceName} {\n${fieldsStr}\n}`;
      })
      .join("\n\n");

    const fileContent = `// ⚠️ Arquivo gerado automaticamente
// Gerado em: ${new Date().toISOString()}

${typeDefinitions}
`;

    fs.writeFileSync(typesPath, fileContent);
    console.log(`✅ Tipos gerados em: ${typesPath}`);
    console.log(`📊 Total de tabelas tipadas: ${Object.keys(schema).length}`);

  } catch (err) {
    console.error("❌ Erro:", err);
    process.exit(1);
  }
}

function inferTypes(obj) {
  const types = {};
  for (const [key, value] of Object.entries(obj)) {
    types[key] = inferType(value);
  }
  return types;
}

function inferType(value) {
  if (value === null) return "any";
  if (typeof value === "string") {
    // Detectar timestamps
    if (/^\d{4}-\d{2}-\d{2}T/.test(value)) return "string"; // timestamp
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return "string"; // date
    return "string";
  }
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (Array.isArray(value)) return "any[]";
  if (typeof value === "object") return "Record<string, any>";
  return "any";
}

function getDefaultSchema(tableName) {
  const defaults = {
    profiles: {
      id: "string",
      role: "string",
      full_name: "string",
      avatar_url: "string",
      cargo: "string",
      department: "string",
      phone: "string",
      notification_preferences: "Record<string, any>",
      created_at: "string",
    },
    companies: {
      id: "string",
      name: "string",
      slug: "string",
      logo_url: "string",
      primary_color: "string",
      settings: "Record<string, any>",
      created_at: "string",
      updated_at: "string",
    },
  };

  return defaults[tableName] || { id: "string", created_at: "string" };
}

generateTypes();
