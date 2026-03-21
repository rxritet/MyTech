import { apiRequest } from "./client";

export interface DevelopmentStage {
  title: string;
  description: string;
}

export type ProjectStatus = "in_progress" | "completed" | "archived";

export interface Project {
  id: number;
  slug: string;
  name: string;
  status: ProjectStatus;
  description: string;
  longDescription: string;
  stack: string[];
  features: string[];
  github?: string;
  demo?: string;
  accentColor: string;
  image?: string;
  gallery?: string[];
  devTime: string;
  language: string;
  createdAt: string;
  developmentProcess?: DevelopmentStage[];
  technologyIds?: number[];
}

export interface ProjectUpsertPayload extends Partial<Project> {
  status?: ProjectStatus;
}

export async function getProjects(): Promise<Project[]> {
  return apiRequest<Project[]>("/api/projects");
}

export async function getProject(slug: string): Promise<Project> {
  return apiRequest<Project>(`/api/projects/${slug}`);
}

/** @security Uses plain secret header. Replace with Bearer JWT in production. */
export async function createProject(payload: ProjectUpsertPayload, secret: string): Promise<Project> {
  return apiRequest<Project>("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": secret,
    },
    body: JSON.stringify(payload),
  });
}

/** @security Uses plain secret header. Replace with Bearer JWT in production. */
export async function updateProject(id: number, payload: ProjectUpsertPayload, secret: string): Promise<Project> {
  return apiRequest<Project>(`/api/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": secret,
    },
    body: JSON.stringify(payload),
  });
}

/** @security Uses plain secret header. Replace with Bearer JWT in production. */
export async function deleteProject(id: number, secret: string): Promise<{ success: boolean; project: Project }> {
  return apiRequest<{ success: boolean; project: Project }>(`/api/projects/${id}`, {
    method: "DELETE",
    headers: {
      "x-admin-secret": secret,
    },
  });
}