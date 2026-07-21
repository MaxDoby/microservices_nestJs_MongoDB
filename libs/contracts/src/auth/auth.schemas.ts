import { z } from 'zod';
import { PASSWORD_PATTERN } from './auth.constants';

export const registerRequestSchema = z
  .object({
    name: z.string().min(1),
    surname: z.string().min(1),
    email: z.email(),
    password: z.string().min(8).regex(PASSWORD_PATTERN, {
      message: 'Password must contain at least one letter and one number.',
    }),
  })
  .strict();

export const loginRequestSchema = z
  .object({
    email: z.email(),
    password: z.string().min(1),
  })
  .strict();

export const refreshTokenRequestSchema = z
  .object({
    refreshToken: z.string().min(1),
  })
  .strict();

export const logoutRequestSchema = refreshTokenRequestSchema;

export const validateTokenRequestSchema = z
  .object({
    authToken: z.string().min(1),
  })
  .strict();

export const logoutResponseSchema = z.object({
  success: z.boolean(),
});

export const authUserSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  surname: z.string().min(1),
  email: z.email(),
});

export const authResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  user: authUserSchema,
});

export const jwtTokenTypeSchema = z.enum(['access', 'refresh']);

export const jwtPayloadSchema = z.object({
  sub: z.string().min(1),
  email: z.email(),
  type: jwtTokenTypeSchema,
});

export const validateTokenResponseSchema = z.object({
  isValid: z.boolean(),
  user: jwtPayloadSchema,
});
