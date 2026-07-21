import { AuthController } from './auth.controller';
import type { AuthService } from './auth.service';

describe('AuthController', () => {
  const authService = {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    refreshToken: jest.fn(),
    validateToken: jest.fn(),
  };

  let controller: AuthController;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new AuthController(authService as unknown as AuthService);
  });

  it('delegates register payload to auth service', async () => {
    const payload = {
      name: 'Max',
      surname: 'Dobinda',
      email: 'max@max.com',
      password: 'password1',
    };

    authService.register.mockResolvedValue({ accessToken: 'access-token' });

    await expect(controller.register(payload)).resolves.toEqual({
      accessToken: 'access-token',
    });
    expect(authService.register).toHaveBeenCalledWith(payload);
  });

  it('delegates login payload to auth service', async () => {
    const payload = {
      email: 'max@max.com',
      password: 'password1',
    };

    authService.login.mockResolvedValue({ accessToken: 'access-token' });

    await expect(controller.login(payload)).resolves.toEqual({
      accessToken: 'access-token',
    });
    expect(authService.login).toHaveBeenCalledWith(payload);
  });

  it('delegates validate token payload to auth service', async () => {
    const payload = {
      authToken: 'access-token',
    };

    authService.validateToken.mockResolvedValue({ isValid: true });

    await expect(controller.validateToken(payload)).resolves.toEqual({
      isValid: true,
    });
    expect(authService.validateToken).toHaveBeenCalledWith(payload);
  });

  it('delegates logout payload to auth service', async () => {
    const payload = {
      refreshToken: 'refresh-token',
    };

    authService.logout.mockResolvedValue({ success: true });

    await expect(controller.logout(payload)).resolves.toEqual({ success: true });
    expect(authService.logout).toHaveBeenCalledWith(payload);
  });

  it('delegates refresh token payload to auth service', async () => {
    const payload = {
      refreshToken: 'refresh-token',
    };

    authService.refreshToken.mockResolvedValue({ accessToken: 'new-access-token' });

    await expect(controller.refreshToken(payload)).resolves.toEqual({
      accessToken: 'new-access-token',
    });
    expect(authService.refreshToken).toHaveBeenCalledWith(payload);
  });
});
