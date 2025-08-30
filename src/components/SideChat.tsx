// src/components/SideChat.tsx
import React, { useState } from "react";

type Message = { role: "system" | "user" | "assistant"; content: string };

export default function SideChat() {
  const [system, setSystem] = useState("Ты — инженер студии. Отвечай кратко.");
  const [input, setInput] = useState("");
  const [log, setLog] = useState<Message[]>([]); // история в UI
  const [busy, setBusy] = useState(false);

  async function ask() {
    const prompt = input.trim();
    if (!prompt || busy) return;

    // добавим в лог сообщение пользователя
    setLog((prev) => [...prev, { role: "user", content: prompt }]);
    setInput("");
    setBusy(true);

    try {
      const payload = {
        messages: [
          { role: "system", content: system },
          ...log, // предыдущая переписка (user/assistant)
          { role: "user", content: prompt },
        ],
      };

      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await r.json();
      const reply = data?.reply || data?.error || "Нет ответа";
      setLog((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e: any) {
      setLog((prev) => [
        ...prev,
        { role: "assistant", content: `Ошибка: ${e?.message || e}` },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label style={{ fontWeight: 600 }}>Chat | Preview</label>

      <div>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>System prompt</div>
        <textarea
          value={system}
          onChange={(e) => setSystem(e.target.value)}
          rows={4}
          style={{ width: "100%" }}
        />
      </div>

      <div>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Сообщение</div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          placeholder="Напиши запрос…"
          style={{ width: "100%" }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) ask();
          }}
        />
      </div>

      <button onClick={ask} disabled={busy} style={{ padding: 8 }}>
        {busy ? "Думаю…" : "Ask"}
      </button>

      <div style={{ border: "1px solid #ccc", minHeight: 160, padding: 8 }}>
        {log.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <b>{m.role}:</b> {m.content}
          </div>
        ))}
      </div>
    </div>
  );
}