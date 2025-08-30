// src/pages/projects/[id].tsx
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState, FormEvent } from "react";
import { getProject, updateProject, deleteProject } from "@/lib/supabaseApi";
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

  useEffect(() => {
    if (!id || Array.isArray(id)) return;
    (async () => {
      try {
        const data = await getProject(id);
        setItem(data);
        setName(data.name ?? "");
        setDescription(data.description ?? "");
      } catch (e: any) {
        setError(e.message ?? "Не удалось загрузить проект");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!id || Array.isArray(id)) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateProject(id, {
        name: name.trim() || null as any,
        description: description.trim() || null,
      });
      setItem(updated);
      router.push("/");
    } catch (e: any) {
      setError(e.message ?? "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!id || Array.isArray(id)) return;
    if (!confirm("Удалить проект?")) return;
    try {
      await deleteProject(id);
      router.push("/");
    } catch (e: any) {
      setError(e.message ?? "Не удалось удалить");
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Редактирование проекта</h1>
          <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">← Назад</Link>
        </div>

        {loading ? (
          <p className="text-neutral-500">Загрузка…</p>
        ) : error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">Ошибка: {error}</p>
        ) : !item ? (
          <p className="text-neutral-500">Проект не найден</p>
        ) : (
          <form onSubmit={onSave} className="grid max-w-xl gap-3">
            <input
              className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none ring-0 focus:border-neutral-400"
              placeholder="Название"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="min-h-[100px] rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-neutral-400"
              placeholder="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="mt-2 flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-10 items-center rounded-md bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
              >
                {saving ? "Сохранение…" : "Сохранить"}
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex h-10 items-center rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-500"
              >
                Удалить
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}