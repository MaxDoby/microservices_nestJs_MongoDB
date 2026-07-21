import type {
  AuthResponseDto,
  ErrorResponseDto,
} from '@financial-tracker/generated-api';
import { zAuthControllerRefreshTokenResponse } from '@financial-tracker/generated-api';

type RefreshTokenResponse = AuthResponseDto;
type ErrorResponse = ErrorResponseDto;

const getApiUrl = () => {
  const apiUrl = import.meta.env['VITE_API_URL'];

  if (!apiUrl) {
    throw new Error('VITE_API_URL is not configured.');
  }

  return apiUrl;
};

export const clearAuthStorage = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('authUser');
};

export const logoutRequest = async (): Promise<void> => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    clearAuthStorage();
    return;
  }

  try {
    await fetch(`${getApiUrl()}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
  } finally {
    clearAuthStorage();
  }
};

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    clearAuthStorage();
    throw new Error('Session expired. Please login again.');
  }

  const response = await fetch(`${getApiUrl()}/auth/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = (await response.json()) as RefreshTokenResponse | ErrorResponse;

  if (!response.ok) {
    const errorData = data as ErrorResponse;
    clearAuthStorage();
    throw new Error(
      errorData.message ?? 'Session expired. Please login again.',
    );
  }

  const authData = zAuthControllerRefreshTokenResponse.parse(data);

  localStorage.setItem('accessToken', authData.accessToken);
  localStorage.setItem('refreshToken', authData.refreshToken);
  localStorage.setItem('authUser', JSON.stringify(authData.user));

  return authData.accessToken;
};

export const authenticatedFetch = async (
  path: string,
  options: RequestInit = {},
): Promise<Response> => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    throw new Error('You must login first.');
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${accessToken}`);

  const response = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    headers,
  });

  if (response.status !== 401) {
    return response;
  }

  const newAccessToken = await refreshAccessToken();
  const retryHeaders = new Headers(options.headers);
  retryHeaders.set('Authorization', `Bearer ${newAccessToken}`);

  return fetch(`${getApiUrl()}${path}`, {
    ...options,
    headers: retryHeaders,
  });
};
