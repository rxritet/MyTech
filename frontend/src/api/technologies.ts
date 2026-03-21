import { apiRequest } from "./client";

export type TechnologyCategory =
  | "language"
  | "backend"
  | "frontend"
  | "devops"
  | "tool"
  | "mobile";

export interface Technology {
  id: number;
  name: string;
  category: TechnologyCategory;
  badgeUrl: string;
  deviconSlug: string | null;
  createdAt: string;
}

export interface PublicStackItem {
  id: number;
  technologyId: number;
  name: string;
  category: string;
  badgeUrl: string;
  deviconSlug: string | null;
  order: number;
}

export async function getTechnologies(): Promise<Technology[]> {
  return apiRequest<Technology[]>("/api/technologies");
}

/** @security Uses plain secret header. Replace with Bearer JWT in production. */
export async function createTechnology(
  payload: Pick<Technology, "name" | "category" | "deviconSlug"> & { badgeUrl?: string },
  secret: string,
): Promise<Technology> {
  return apiRequest<Technology>("/api/technologies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": secret,
    },
    body: JSON.stringify(payload),
  });
}

/** @security Uses plain secret header. Replace with Bearer JWT in production. */
export async function updateTechnology(
  id: number,
  payload: Partial<Pick<Technology, "name" | "category" | "deviconSlug">> & { badgeUrl?: string },
  secret: string,
): Promise<Technology> {
  return apiRequest<Technology>(`/api/technologies/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": secret,
    },
    body: JSON.stringify(payload),
  });
}

/** @security Uses plain secret header. Replace with Bearer JWT in production. */
export async function deleteTechnology(id: number, secret: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/api/technologies/${id}`, {
    method: "DELETE",
    headers: {
      "x-admin-secret": secret,
    },
  });
}