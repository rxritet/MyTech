import { apiRequest } from "./client";
import type { PublicStackItem } from "./technologies";

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

export async function getHomeStack(): Promise<HomeStackCategory[]> {
  return apiRequest<HomeStackCategory[]>("/api/stack/home");
}

/** @security Uses plain secret header. Replace with Bearer JWT in production. */
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

/** @security Uses plain secret header. Replace with Bearer JWT in production. */
export async function deleteHomeStackCategory(id: number, secret: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/api/admin/stack/home/categories/${id}`, {
    method: "DELETE",
    headers: {
      "x-admin-secret": secret,
    },
  });
}

/** @security Uses plain secret header. Replace with Bearer JWT in production. */
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

/** @security Uses plain secret header. Replace with Bearer JWT in production. */
export async function deleteHomeStackItem(id: number, secret: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/api/admin/stack/home/items/${id}`, {
    method: "DELETE",
    headers: {
      "x-admin-secret": secret,
    },
  });
}

/** @security Uses plain secret header. Replace with Bearer JWT in production. */
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

/** @security Uses plain secret header. Replace with Bearer JWT in production. */
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