// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !anon) {
  throw new Error("Supabase env vars are missing. Check .env.local");
}

export const supabase = createClient(url, anon, {
  auth: { persistSession: false }
});