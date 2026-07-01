import {
  AuthResponse,
  AuthUser,
  JwtPayload,
  JwtTokenType,
} from '@financial-tracker/contracts';
import { UserDocument } from '../schemas/user.schema';

export const toJwtPayload = (
  user: UserDocument,
  type: JwtTokenType,
): JwtPayload => ({
  sub: user.id,
  email: user.email,
  type,
});

export const toAuthUser = (user: UserDocument): AuthUser => ({
  id: user.id,
  name: user.name,
  surname: user.surname,
  email: user.email,
});

export const toAuthResponse = (
  user: UserDocument,
  accessToken: string,
  refreshToken: string,
): AuthResponse => ({
  accessToken,
  refreshToken,
  user: toAuthUser(user),
});
