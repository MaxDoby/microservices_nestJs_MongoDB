import type { AuthFormState, AuthMode } from '../types/auth.types';
import type { AuthResponseDto } from '@financial-tracker/generated-api';
import {
  zAuthControllerLoginBody,
  zAuthControllerLoginResponse,
  zAuthControllerRegisterBody,
  zAuthControllerRegisterResponse,
} from '@financial-tracker/generated-api';

type AuthResponse = AuthResponseDto;

const API_URL = import.meta.env.VITE_API_URL;

export const authenticateRequest = async (
  mode: AuthMode,
  form: AuthFormState,
): Promise<AuthResponse> => {
  const endpoint = mode === 'login' ? 'auth/login' : 'auth/register';

  const body =
    mode === 'login'
      ? zAuthControllerLoginBody.parse({
          email: form.email,
          password: form.password,
        })
      : zAuthControllerRegisterBody.parse(form);

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

  return mode === 'login'
    ? zAuthControllerLoginResponse.parse(data)
    : zAuthControllerRegisterResponse.parse(data);
};
