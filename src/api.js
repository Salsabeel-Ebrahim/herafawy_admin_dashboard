// Dev: '/backend' is proxied by Vite. Production: set VITE_API_URL.
const BASE = import.meta.env.VITE_API_URL || '/backend';

export async function api(path, opts = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(BASE + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || `Request failed (${res.status})`);
  return data;
}
