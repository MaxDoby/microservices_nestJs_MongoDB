import { z } from 'zod';

export const registerRequestSchema = z.object({
	name: z.string().min(1),
	surname: z.string().min(1),
	email: z.email(),
	password: z.string().min(8)
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export const loginRequestSchema = z.object({
	email: z.email(),
	password: z.string().min(1),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const refreshTokenRequestSchema = z.object({
	refreshToken: z.string().min(1),
});

export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;

export const logoutRequestSchema = refreshTokenRequestSchema;

export type LogoutRequest = z.infer<typeof logoutRequestSchema>;

export const validateTokenRequestSchema = z.object({
	authToken: z.string().min(1),
});

export type ValidateTokenRequest = z.infer<typeof validateTokenRequestSchema>; 


export interface LogoutResponse {
  success: boolean;
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

export interface ValidateTokenResponse {
  isValid: boolean;
  user: JwtPayload;
}
