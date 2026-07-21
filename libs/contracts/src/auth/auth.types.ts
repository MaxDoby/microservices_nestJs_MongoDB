import { z } from 'zod';
import {
  authResponseSchema,
  authUserSchema,
  jwtPayloadSchema,
  jwtTokenTypeSchema,
  loginRequestSchema,
  logoutRequestSchema,
  logoutResponseSchema,
  refreshTokenRequestSchema,
  registerRequestSchema,
  validateTokenRequestSchema,
  validateTokenResponseSchema,
} from './auth.schemas';

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;
export type LogoutRequest = z.infer<typeof logoutRequestSchema>;
export type ValidateTokenRequest = z.infer<typeof validateTokenRequestSchema>;
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type JwtTokenType = z.infer<typeof jwtTokenTypeSchema>;
export type JwtPayload = z.infer<typeof jwtPayloadSchema>;
export type ValidateTokenResponse = z.infer<typeof validateTokenResponseSchema>;
