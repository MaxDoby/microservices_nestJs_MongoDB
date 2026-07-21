import { of } from 'rxjs';
import { AuthController } from './auth.controller';
import type { ApiGatewayService } from '../api-gateway.service';

describe('AuthController', () => {
  const apiGatewayService = {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    refreshToken: jest.fn(),
    validateToken: jest.fn(),
  };

  let controller: AuthController;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new AuthController(apiGatewayService as unknown as ApiGatewayService);
  });

  it('delegates register request to api gateway service', () => {
    const body = {
      name: 'Max',
      surname: 'Dobinda',
      email: 'max@max.com',
      password: 'password1',
    };
    const response = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: {
        id: '6a426f90fcc2f5e584cb060a',
        name: 'Max',
        surname: 'Dobinda',
        email: 'max@max.com',
      },
    };

    apiGatewayService.register.mockReturnValue(of(response));

    expect(controller.register(body)).toBe(apiGatewayService.register.mock.results[0].value);
    expect(apiGatewayService.register).toHaveBeenCalledWith(body);
  });

  it('delegates login request to api gateway service', () => {
    const body = {
      email: 'max@max.com',
      password: 'password1',
    };

    apiGatewayService.login.mockReturnValue(of({ accessToken: 'access-token' }));

    expect(controller.login(body)).toBe(apiGatewayService.login.mock.results[0].value);
    expect(apiGatewayService.login).toHaveBeenCalledWith(body);
  });

  it('delegates logout request to api gateway service', () => {
    const body = {
      refreshToken: 'refresh-token',
    };

    apiGatewayService.logout.mockReturnValue(of({ success: true }));

    expect(controller.logout(body)).toBe(apiGatewayService.logout.mock.results[0].value);
    expect(apiGatewayService.logout).toHaveBeenCalledWith(body);
  });

  it('delegates refresh token request to api gateway service', () => {
    const body = {
      refreshToken: 'refresh-token',
    };

    apiGatewayService.refreshToken.mockReturnValue(of({ accessToken: 'access-token' }));

    expect(controller.refreshToken(body)).toBe(
      apiGatewayService.refreshToken.mock.results[0].value,
    );
    expect(apiGatewayService.refreshToken).toHaveBeenCalledWith(body);
  });

  it('delegates validate token request to api gateway service', () => {
    const body = {
      authToken: 'access-token',
    };

    apiGatewayService.validateToken.mockReturnValue(of({ isValid: true }));

    expect(controller.validateToken(body)).toBe(
      apiGatewayService.validateToken.mock.results[0].value,
    );
    expect(apiGatewayService.validateToken).toHaveBeenCalledWith(body);
  });
});
