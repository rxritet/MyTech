const API_BASE = import.meta.env.VITE_API_URL;
if (!API_BASE) throw new Error("[api] VITE_API_URL is not set. Check your .env file.");

export function buildApiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
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