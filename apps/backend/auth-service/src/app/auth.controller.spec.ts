import { Test, TestingModule } from '@nestjs/testing';
import {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  ValidateTokenRequest,
} from '@financial-tracker/contracts';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;

  const authService = {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    refreshToken: jest.fn(),
    validateToken: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  it('delegates register payload to auth service', async () => {
    const payload: RegisterRequest = {
      name: 'Max',
      surname: 'Dobinda',
      email: 'max@max.com',
      password: 'password1',
    };

    authService.register.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: {
        id: '6a426f90fcc2f5e584cb060a',
        name: 'Max',
        surname: 'Dobinda',
        email: 'max@max.com',
      },
    });

    const result = await authController.register(payload);

    expect(authService.register).toHaveBeenCalledWith(payload);
    expect(result.accessToken).toBe('access-token');
  });

  it('delegates login payload to auth service', async () => {
    const payload: LoginRequest = {
      email: 'max@max.com',
      password: 'password1',
    };

    authService.login.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: {
        id: '6a426f90fcc2f5e584cb060a',
        name: 'Max',
        surname: 'Dobinda',
        email: 'max@max.com',
      },
    });

    const result = await authController.login(payload);

    expect(authService.login).toHaveBeenCalledWith(payload);
    expect(result.user.email).toBe('max@max.com');
  });

  it('delegates logout payload to auth service', async () => {
    const payload: RefreshTokenRequest = {
      refreshToken: 'refresh-token',
    };

    authService.logout.mockResolvedValue({ success: true });

    const result = await authController.logout(payload);

    expect(authService.logout).toHaveBeenCalledWith(payload);
    expect(result).toEqual({ success: true });
  });

  it('delegates refresh token payload to auth service', async () => {
    const payload: RefreshTokenRequest = {
      refreshToken: 'refresh-token',
    };

    authService.refreshToken.mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      user: {
        id: '6a426f90fcc2f5e584cb060a',
        name: 'Max',
        surname: 'Dobinda',
        email: 'max@max.com',
      },
    });

    const result = await authController.refreshToken(payload);

    expect(authService.refreshToken).toHaveBeenCalledWith(payload);
    expect(result.accessToken).toBe('new-access-token');
  });

  it('delegates validate token payload to auth service', async () => {
    const payload: ValidateTokenRequest = {
      authToken: 'access-token',
    };

    authService.validateToken.mockResolvedValue({
      isValid: true,
      user: {
        sub: '6a426f90fcc2f5e584cb060a',
        email: 'max@max.com',
        type: 'access',
      },
    });

    const result = await authController.validateToken(payload);

    expect(authService.validateToken).toHaveBeenCalledWith(payload);
    expect(result.isValid).toBe(true);
  });
});
