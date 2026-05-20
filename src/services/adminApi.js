import { supabase } from "../lib/supabase";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

export function hasAdminApi() {
  return Boolean(API_BASE_URL);
}

export async function adminApi(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error("Admin API is not configured. Set VITE_BACKEND_URL in the admin .env file.");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Please log in with a real Supabase admin account to view live user-site bookings and payments.");
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      ...(options.headers || {}),
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await res.json() : null;

  if (!res.ok || body?.success === false) {
    throw new Error(body?.message || `Admin API request failed with status ${res.status}.`);
  }

  return body?.data ?? body;
}
