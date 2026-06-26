export interface RegisterRequest {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface LoginRequest {
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

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface ValidateTokenRequest {
  authToken: string;
}

export interface ValidateTokenResponse {
  isValid: boolean;
  user: JwtPayload;
}
