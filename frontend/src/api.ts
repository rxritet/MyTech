const API_BASE = import.meta.env.VITE_API_URL ?? "";

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
