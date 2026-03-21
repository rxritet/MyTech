import { apiRequest } from "./client";

export type EmploymentType =
  | "full_time"
  | "part_time"
  | "internship"
  | "freelance"
  | "contract";

export type WorkFormat = "onsite" | "remote" | "hybrid";

export interface WorkExperience {
  id: number;
  company: string;
  position: string;
  location: string;
  industry?: string;
  employmentType: EmploymentType;
  format: WorkFormat;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  bullets: string[];
  stack: string[];
  order: number;
  createdAt: string;
}

export type WorkExperiencePayload = Omit<WorkExperience, "id" | "createdAt">;

export async function getWorkExperience(): Promise<WorkExperience[]> {
  return apiRequest<WorkExperience[]>("/api/work-experience");
}

/** @security Uses plain secret header. Replace with Bearer JWT in production. */
export async function createWorkExperience(
  payload: WorkExperiencePayload,
  secret: string,
): Promise<WorkExperience> {
  return apiRequest<WorkExperience>("/api/work-experience", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": secret,
    },
    body: JSON.stringify(payload),
  });
}

/** @security Uses plain secret header. Replace with Bearer JWT in production. */
export async function updateWorkExperience(
  id: number,
  payload: WorkExperiencePayload,
  secret: string,
): Promise<WorkExperience> {
  return apiRequest<WorkExperience>(`/api/work-experience/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": secret,
    },
    body: JSON.stringify(payload),
  });
}

/** @security Uses plain secret header. Replace with Bearer JWT in production. */
export async function deleteWorkExperience(
  id: number,
  secret: string,
): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/api/work-experience/${id}`, {
    method: "DELETE",
    headers: { "x-admin-secret": secret },
  });
}