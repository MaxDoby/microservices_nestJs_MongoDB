import type {
  AuthFormState,
  AuthMode,
  AuthResponse,
} from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL;

export const authenticateRequest = async (
  mode: AuthMode,
  form: AuthFormState,
): Promise<AuthResponse> => {
  const endpoint = mode === 'login' ? 'auth/login' : 'auth/register';

  const body =
    mode === 'login' ? { email: form.email, password: form.password } : form;

  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Authentication failed.');
  }

  return data;
};
