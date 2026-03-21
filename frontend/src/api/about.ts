import { apiRequest } from "./client";

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