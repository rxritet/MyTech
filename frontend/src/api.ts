const API_BASE = import.meta.env.VITE_API_URL ?? "";

export interface AboutFocusArea {
  title: string;
  desc: string;
}
export interface AboutProject {
  name: string;
  desc: string;
  stack: string;
}
export interface AboutEducation {
  name: string;
  desc: string;
}
export interface AboutHobby {
  emoji: string;
  title: string;
  desc: string;
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
  const res = await fetch(`${API_BASE}/api/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Ошибка отправки: ${res.status}`);
  }

  return res.json() as Promise<Contact>;
}

export async function getContacts(): Promise<Contact[]> {
  const res = await fetch(`${API_BASE}/api/contacts`);
  if (!res.ok) throw new Error(`Ошибка загрузки: ${res.status}`);
  return res.json() as Promise<Contact[]>;
}

export async function getAbout(): Promise<AboutData> {
  const res = await fetch(`${API_BASE}/api/about`);
  if (!res.ok) throw new Error(`Ошибка загрузки: ${res.status}`);
  return res.json() as Promise<AboutData>;
}

export async function updateAbout(payload: Partial<AboutData>, secret: string): Promise<AboutData> {
  const res = await fetch(`${API_BASE}/api/about`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": secret,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Ошибка обновления: ${res.status}`);
  return res.json() as Promise<AboutData>;
}
