import { useEffect, useState } from "react";
import type { ProjectRow } from "@/lib/types";
import { listProjects, createProject, deleteProject, updateProject } from "@/lib/projectsApi";

const ProjectsPage = () => {
  const [items, setItems] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { items } = await listProjects();
        setItems(items);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      const p = await createProject({ name: name.trim(), description: description || undefined });
      setItems(prev => [p, ...prev]);
      setName(""); setDescription("");
    } catch (e: any) {
      alert(e.message ?? "Create failed");
    } finally {
      setCreating(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Удалить проект?")) return;
    try {
      await deleteProject(id);
      setItems(prev => prev.filter(p => p.id !== id));
    } catch (e: any) {
      alert(e.message ?? "Delete failed");
    }
  };

  const onInlineEdit = async (p: ProjectRow) => {
    const newName = prompt("Новое имя:", p.name) ?? p.name;
    const newDesc = prompt("Описание:", p.description ?? "") ?? p.description ?? "";
    try {
      const u = await updateProject(p.id, { name: newName, description: newDesc });
      setItems(prev => prev.map(x => (x.id === p.id ? u : x)));
    } catch (e: any) {
      alert(e.message ?? "Update failed");
    }
  };

  if (loading) return <p className="p-6">Загрузка…</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Projects</h1>

      <form onSubmit={onCreate} className="flex gap-2 items-center">
        <input
          className="border rounded px-3 py-2"
          placeholder="Название"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Описание (необязательно)"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
          disabled={creating}
          type="submit"
        >
          {creating ? "Создаём…" : "Создать"}
        </button>
      </form>

      {items.length === 0 ? (
        <p>Пока пусто.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((p: ProjectRow) => (
            <li key={p.id} className="border rounded p-3 flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm opacity-70">{new Date(p.created_at).toLocaleString()}</div>
                {p.description && <div className="mt-1">{p.description}</div>}
              </div>
              <div className="flex gap-2">
                <button className="border px-3 py-1 rounded" type="button" onClick={() => onInlineEdit(p)}>Редактировать</button>
                <button className="border px-3 py-1 rounded text-red-600" type="button" onClick={() => onDelete(p.id)}>Удалить</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectsPage;