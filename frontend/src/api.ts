const API_BASE = import.meta.env.VITE_API_URL ?? "";

function buildApiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(buildApiUrl(path), init);

  if (!res.ok) {
    const contentType = res.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      if (body?.error) {
        throw new Error(body.error);
      }
    } else {
      const text = await res.text().catch(() => "");
      if (text.trim()) {
        throw new Error(text.trim());
      }
    }

    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export interface AboutFocusArea {
  title: string;
  desc: string;
}
export interface AboutProject {
  name: string;
  desc: string;
  stack: string;
  github?: string;
}
export interface AboutEducation {
  name: string;
  desc: string;
  href: string;
}
export interface AboutHobby {
  emoji: string;
  title: string;
  desc: string;
}
export interface AboutTechGroup {
  title: string;
  description?: string;
  desc?: string;
  names: string[];
}

export interface AboutData {
  id: number;
  name: string;
  location: string;
  tagline: string;
  bio1: string;
  bio2: string;
  quote: string;
  university: string;
  status: string;
  resumeUrl: string;
  avatarUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  telegramUrl: string;
  email: string;
  focusAreas: AboutFocusArea[];
  competencies: string[];
  projects: AboutProject[];
  education: AboutEducation[];
  hobbies: AboutHobby[];
  techGroups: AboutTechGroup[];
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export interface Contact extends ContactPayload {
  id: number;
  createdAt: string;
}

export async function submitContact(payload: ContactPayload): Promise<Contact> {
  return apiRequest<Contact>("/api/contacts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getContacts(): Promise<Contact[]> {
  return apiRequest<Contact[]>("/api/contacts");
}

export async function getAbout(): Promise<AboutData> {
  return apiRequest<AboutData>("/api/about");
}

export async function updateAbout(payload: Partial<AboutData>, secret: string): Promise<AboutData> {
  return apiRequest<AboutData>("/api/about", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": secret,
    },
    body: JSON.stringify(payload),
  });
}

export interface DevelopmentStage {
  title: string;
  description: string;
}

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

export interface HomeStackItem {
  id: number;
  name: string;
  order: number;
}

export interface HomeStackCategory {
  id: number;
  slug: string;
  label: string;
  order: number;
  items: HomeStackItem[];
}

export interface Project {
  id: number;
  slug: string;
  name: string;
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

export async function getProjects(): Promise<Project[]> {
  return apiRequest<Project[]>("/api/projects");
}

export async function getProject(slug: string): Promise<Project> {
  return apiRequest<Project>(`/api/projects/${slug}`);
}

export async function createProject(payload: Partial<Project>, secret: string): Promise<Project> {
  return apiRequest<Project>("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": secret,
    },
    body: JSON.stringify(payload),
  });
}

export async function updateProject(id: number, payload: Partial<Project>, secret: string): Promise<Project> {
  return apiRequest<Project>(`/api/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": secret,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteProject(id: number, secret: string): Promise<{ success: boolean; project: Project }> {
  return apiRequest<{ success: boolean; project: Project }>(`/api/projects/${id}`, {
    method: "DELETE",
    headers: {
      "x-admin-secret": secret,
    },
  });
}

export async function getTechnologies(): Promise<Technology[]> {
  return apiRequest<Technology[]>("/api/technologies");
}

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

export async function deleteTechnology(id: number, secret: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/api/technologies/${id}`, {
    method: "DELETE",
    headers: {
      "x-admin-secret": secret,
    },
  });
}

export async function getHomeStack(): Promise<HomeStackCategory[]> {
  return apiRequest<HomeStackCategory[]>("/api/stack/home");
}

export async function createHomeStackCategory(
  payload: Pick<HomeStackCategory, "slug" | "label">,
  secret: string,
): Promise<HomeStackCategory> {
  return apiRequest<HomeStackCategory>("/api/admin/stack/home/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": secret,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteHomeStackCategory(id: number, secret: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/api/admin/stack/home/categories/${id}`, {
    method: "DELETE",
    headers: {
      "x-admin-secret": secret,
    },
  });
}

export async function createHomeStackItem(
  payload: { category_id: number; name: string },
  secret: string,
): Promise<HomeStackItem> {
  return apiRequest<HomeStackItem>("/api/admin/stack/home/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": secret,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteHomeStackItem(id: number, secret: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/api/admin/stack/home/items/${id}`, {
    method: "DELETE",
    headers: {
      "x-admin-secret": secret,
    },
  });
}

export async function updateHomeStackOrder(
  payload: {
    categories: Array<{ id: number; order: number }>;
    items: Array<{ id: number; order: number }>;
  },
  secret: string,
): Promise<HomeStackCategory[]> {
  return apiRequest<HomeStackCategory[]>("/api/admin/stack/home/order", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": secret,
    },
    body: JSON.stringify(payload),
  });
}

export async function getAboutStack(): Promise<PublicStackItem[]> {
  return apiRequest<PublicStackItem[]>("/api/stack/about");
}

export async function updateAboutStack(
  payload: { items: Array<{ technologyId: number; category: string; order: number }> },
  secret: string,
): Promise<PublicStackItem[]> {
  return apiRequest<PublicStackItem[]>("/api/stack/about", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": secret,
    },
    body: JSON.stringify(payload),
  });
}
