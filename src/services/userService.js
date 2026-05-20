const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export const signUpUser = async ({ fullName, email, password }) => {
  const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, password }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) throw new Error(data.message || 'Sign up failed.');

  return data;
};
