const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default async function adminApi(endpoint) {
  const response = await fetch(`${BASE_URL}/api/admin${endpoint}`);

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json();
}