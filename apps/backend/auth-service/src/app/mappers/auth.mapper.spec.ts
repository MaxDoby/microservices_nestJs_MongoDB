import { UserDocument } from '../schemas/user.schema';
import { toAuthResponse, toAuthUser, toJwtPayload } from './auth.mapper';

const buildUser = (user: Partial<UserDocument>): UserDocument => {
  return user as UserDocument;
};

describe('auth.mapper', () => {
  const user = buildUser({
    id: '6a426f90fcc2f5e584cb060a',
    name: 'Max',
    surname: 'Dobinda',
    email: 'max@max.com',
    password: 'hashed-password',
    refreshTokenHash: 'hashed-refresh-token',
  });

  it('maps user document to JWT access payload', () => {
    const payload = toJwtPayload(user, 'access');

    expect(payload).toEqual({
      sub: '6a426f90fcc2f5e584cb060a',
      email: 'max@max.com',
      type: 'access',
    });
  });

  it('maps user document to JWT refresh payload', () => {
    const payload = toJwtPayload(user, 'refresh');

    expect(payload).toEqual({
      sub: '6a426f90fcc2f5e584cb060a',
      email: 'max@max.com',
      type: 'refresh',
    });
  });

  it('maps user document to public auth user without sensitive fields', () => {
    const authUser = toAuthUser(user);

    expect(authUser).toEqual({
      id: '6a426f90fcc2f5e584cb060a',
      name: 'Max',
      surname: 'Dobinda',
      email: 'max@max.com',
    });

    expect(authUser).not.toHaveProperty('password');
    expect(authUser).not.toHaveProperty('refreshTokenHash');
  });

  it('maps user document and tokens to auth response', () => {
    const response = toAuthResponse(user, 'access-token', 'refresh-token');

    expect(response).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: {
        id: '6a426f90fcc2f5e584cb060a',
        name: 'Max',
        surname: 'Dobinda',
        email: 'max@max.com',
      },
    });
  });

  it('throws validation error when user email is invalid', () => {
    const invalidUser = buildUser({
      id: '6a426f90fcc2f5e584cb060a',
      name: 'Max',
      surname: 'Dobinda',
      email: 'invalid-email',
    });

    expect(() => toAuthUser(invalidUser)).toThrow();
  });
});
