import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
  }

  try {
    const { messages } = req.body as { messages: { role: "system" | "user" | "assistant"; content: string }[] };
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages is required (array)" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.3
    });

    const text = completion.choices?.[0]?.message?.content ?? "";
    return res.status(200).json({ reply: text });
  } catch (e: any) {
    console.error("AI error:", e?.message || e);
    return res.status(500).json({ error: e?.message || "AI error" });
  }
}
