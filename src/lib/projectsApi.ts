import type { ProjectRow } from "@/lib/types";
import { http } from "@/lib/http";

export function listProjects() {
  return http<{ items: ProjectRow[] }>("/api/projects");
}

export function createProject(body: { name: string; description?: string }) {
  return http<ProjectRow>("/api/projects", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export function getProject(id: string) {
  return http<ProjectRow>(`/api/projects/${id}`);
}

export function updateProject(id: string, body: Partial<Pick<ProjectRow, "name" | "description">>) {
  return http<ProjectRow>(`/api/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(body)
  });
}

export function deleteProject(id: string) {
  return http<{ ok: true }>(`/api/projects/${id}`, { method: "DELETE" });
}
