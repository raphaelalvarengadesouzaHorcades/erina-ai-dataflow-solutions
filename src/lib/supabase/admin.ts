import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase com Service Role Key.
 * ⚠️ Use SÓ em Server Components, API Routes ou Edge Functions.
 * Nunca exponha no browser — essa chave ignora RLS.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
