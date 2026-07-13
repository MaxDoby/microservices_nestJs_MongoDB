import {
  AuthResponse,
  AuthUser,
  JwtPayload,
  JwtTokenType,
  authResponseSchema,
  authUserSchema,
  jwtPayloadSchema,
} from '@financial-tracker/contracts';
import { UserDocument } from '../schemas/user.schema';

export const toJwtPayload = (
  user: UserDocument,
  type: JwtTokenType,
): JwtPayload => {
  const payload = {
    sub: user.id,
    email: user.email,
    type,
  };
  return jwtPayloadSchema.parse(payload);
};

export const toAuthUser = (user: UserDocument): AuthUser => {
  const authUser = {
    id: user.id,
    name: user.name,
    surname: user.surname,
    email: user.email,
  };

  return authUserSchema.parse(authUser);
};

export const toAuthResponse = (
  user: UserDocument,
  accessToken: string,
  refreshToken: string,
): AuthResponse => {
  const authResponse = {
    accessToken,
    refreshToken,
    user: toAuthUser(user),
  };
  return authResponseSchema.parse(authResponse);
};
