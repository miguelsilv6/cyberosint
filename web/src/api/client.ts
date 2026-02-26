const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export async function api(path: string, method = 'GET', body?: unknown, token?: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
