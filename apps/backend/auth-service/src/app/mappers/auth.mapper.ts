import {
  AuthResponse,
  AuthUser,
  JwtPayload,
} from '@financial-tracker/contracts';
import { UserDocument } from '../schemas/user.schema';

export const toJwtPayload = (user: UserDocument): JwtPayload => ({
  sub: user.id,
  email: user.email,
});

export const toAuthUser = (user: UserDocument): AuthUser => ({
  id: user.id,
  name: user.name,
  surname: user.surname,
  email: user.email,
});

export const toAuthResponse = (
  user: UserDocument,
  authToken: string,
): AuthResponse => ({
  authToken,
  user: toAuthUser(user),
});
