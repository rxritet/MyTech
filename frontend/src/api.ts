const API_BASE = import.meta.env.VITE_API_URL ?? "";

function buildApiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(buildApiUrl(path), init);

  if (!res.ok) {
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
  devTime: string;
  language: string;
  createdAt: string;
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
