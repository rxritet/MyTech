import { apiRequest } from "./client";

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