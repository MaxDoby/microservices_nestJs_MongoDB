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

export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutResponse {
  success: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  name: string;
  surname: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export type JwtTokenType = 'access' | 'refresh';

export interface JwtPayload {
  sub: string;
  email: string;
  type: JwtTokenType;
}

export interface ValidateTokenRequest {
  authToken: string;
}

export interface ValidateTokenResponse {
  isValid: boolean;
  user: JwtPayload;
}
