// src/lib/supabaseServer.ts
import { createClient } from "@supabase/supabase-js";

export function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // на случай, если service role ещё не задан

  return createClient(url, key, { auth: { persistSession: false } });
}