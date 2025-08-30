// src/pages/api/projects/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabase } from "@/lib/supabaseServer";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabase();

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ items: data });
  }

  if (req.method === "POST") {
    const { name, description } = req.body as { name: string; description?: string };
    if (!name?.trim()) return res.status(400).json({ error: "name is required" });

    const { data, error } = await supabase
      .from("projects")
      .insert({ name: name.trim(), description: description ?? null })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  res.setHeader("Allow", "GET,POST");
  return res.status(405).json({ error: "Method Not Allowed" });
}