export type AuthMode = 'login' | 'register';

export interface AuthFormState {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  surname: string;
  email: string;
}

export interface AuthResponse {
  authToken: string;
  user: AuthUser;
}
