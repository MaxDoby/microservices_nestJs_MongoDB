import { z } from 'zod';

export const registerRequestSchema = z.object({
  name: z.string().min(1),
  surname: z.string().min(1),
  email: z.email(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
      message: 'Password must contain at least one letter and one number.',
    }),
}).strict();

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export const loginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
}).strict();

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const refreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1),
}).strict();

export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;

export const logoutRequestSchema = refreshTokenRequestSchema;

export type LogoutRequest = z.infer<typeof logoutRequestSchema>;

export const validateTokenRequestSchema = z.object({
  authToken: z.string().min(1),
}).strict();

export type ValidateTokenRequest = z.infer<typeof validateTokenRequestSchema>;

export const logoutResponseSchema = z.object({
  success: z.boolean(),
});

export type LogoutResponse = z.infer<typeof logoutResponseSchema>;

export const authUserSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  surname: z.string().min(1),
  email: z.email(),
});

export type AuthUser = z.infer<typeof authUserSchema>;

export const authResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  user: authUserSchema,
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

export const jwtTokenTypeSchema = z.enum(['access', 'refresh']);

export type JwtTokenType = z.infer<typeof jwtTokenTypeSchema>;

export const jwtPayloadSchema = z.object({
  sub: z.string().min(1),
  email: z.email(),
  type: jwtTokenTypeSchema,
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;

export const validateTokenResponseSchema = z.object({
  isValid: z.boolean(),
  user: jwtPayloadSchema,
});

export type ValidateTokenResponse = z.infer<typeof validateTokenResponseSchema>;
