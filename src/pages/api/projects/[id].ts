import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// Таблица в БД
const TABLE = "projects";

// На сервере для изменений лучше использовать service-role ключ.
// Если его нет — разрешим только GET.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseRW = createClient(supabaseUrl, serviceRole || anonKey); // RW (fallback на anon для GET)
const supabaseRO = createClient(supabaseUrl, anonKey);                // RO

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = String(req.query.id || "");

  if (!id) {
    return res.status(400).json({ ok: false, error: "Missing id" });
  }

  try {
    if (req.method === "GET") {
      const { data, error } = await supabaseRO.from(TABLE).select("*").eq("id", id).single();
      if (error) throw error;
      return res.status(200).json({ ok: true, item: data });
    }

    if (req.method === "PUT") {
      if (!serviceRole) {
        return res.status(500).json({ ok: false, error: "Server is not configured for updates. Set SUPABASE_SERVICE_ROLE_KEY." });
      }
      const { name, description } = req.body ?? {};
      if (!name || typeof name !== "string") {
        return res.status(400).json({ ok: false, error: "Field 'name' is required" });
      }
      const { data, error } = await supabaseRW
        .from(TABLE)
        .update({ name, description: description ?? null })
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw error;
      return res.status(200).json({ ok: true, item: data });
    }

    if (req.method === "DELETE") {
      if (!serviceRole) {
        return res.status(500).json({ ok: false, error: "Server is not configured for deletes. Set SUPABASE_SERVICE_ROLE_KEY." });
      }
      const { error } = await supabaseRW.from(TABLE).delete().eq("id", id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET,PUT,DELETE");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "Unexpected error" });
  }
}