export type AuthMode = 'login' | 'register';

export interface AuthFormState {
  name: string;
  surname: string;
  email: string;
  password: string;
}
