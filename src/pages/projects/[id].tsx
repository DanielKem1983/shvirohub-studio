// src/pages/projects/[id].tsx
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ProjectRow } from "@/lib/types";

export default function ProjectEditPage() {
  const router = useRouter();
  const { id } = router.query;

  const [item, setItem] = useState<ProjectRow | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // загрузка проекта
  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/projects/${id}`);
        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.error || "Fetch failed");
        const p: ProjectRow = json.item;
        setItem(p);
        setName(p.name);
        setDescription(p.description ?? "");
      } catch (e: any) {
        setError(e?.message || "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !id) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description || null }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Save failed");
      setItem(json.item);
    } catch (e: any) {
      setError(e?.message || "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!id || !confirm("Удалить проект?")) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Delete failed");
      router.push("/projects");
    } catch (e: any) {
      setError(e?.message || "Ошибка удаления");
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6"><h1 className="text-2xl font-bold">Редактирование проекта</h1><p className="mt-4">Загрузка…</p></div>;

  if (error) return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Редактирование проекта</h1>
      <div className="text-red-600">Ошибка: {error}</div>
      <Link href="/projects" className="underline">← Назад</Link>
    </div>
  );

  if (!item) return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Проект не найден</h1>
      <Link href="/projects" className="underline">← Назад</Link>
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/projects" className="underline">← Назад</Link>
        <h1 className="text-2xl font-bold">Редактирование проекта</h1>
      </div>

      <form onSubmit={onSave} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Название</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Описание</label>
          <textarea
            className="border rounded px-3 py-2 w-full"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {error && <div className="text-red-600">{error}</div>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
          >
            {saving ? "Сохраняю…" : "Сохранить"}
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={saving}
            className="border border-red-600 text-red-600 rounded px-4 py-2 disabled:opacity-50"
          >
            Удалить
          </button>
        </div>
      </form>
    </div>
  );
}