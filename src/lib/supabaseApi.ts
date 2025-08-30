import type { ProjectRow } from "@/lib/types";

async function http<T>(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || `Request failed ${res.status}`);
  }
  return (await res.json()) as T;
}

export function listProjects() {
  return http<{ items: ProjectRow[] }>("/api/projects");
}

export function createProject(body: { name: string; description?: string }) {
  return http<ProjectRow>("/api/projects", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getProject(id: string) {
  return http<ProjectRow>(`/api/projects/${id}`);
}

export function updateProject(id: string, body: { name?: string; description?: string | null }) {
  return http<ProjectRow>(`/api/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function deleteProject(id: string) {
  return http<{ ok: true }>(`/api/projects/${id}`, { method: "DELETE" });
}