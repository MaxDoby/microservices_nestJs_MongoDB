import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { AuthGuard } from './auth.guards';
import type { ApiGatewayService } from '../api-gateway.service';

const buildExecutionContext = (request: unknown): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  }) as ExecutionContext;

describe('AuthGuard', () => {
  const apiGatewayService = {
    validateToken: jest.fn(),
  };

  let guard: AuthGuard;

  beforeEach(() => {
    jest.clearAllMocks();

    guard = new AuthGuard(apiGatewayService as unknown as ApiGatewayService);
  });

  it('rejects requests without Bearer authorization header', async () => {
    const request = {
      headers: {
        authorization: 'invalid-token',
      },
    };

    await expect(
      guard.canActivate(buildExecutionContext(request)),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('validates access token and stores user on request', async () => {
    const request = {
      headers: {
        authorization: 'Bearer access-token',
      },
      user: undefined,
    };
    const user = {
      sub: '6a426f90fcc2f5e584cb060a',
      email: 'max@max.com',
      type: 'access' as const,
    };

    apiGatewayService.validateToken.mockReturnValue(
      of({
        isValid: true,
        user,
      }),
    );

    await expect(guard.canActivate(buildExecutionContext(request))).resolves.toBe(
      true,
    );

    expect(apiGatewayService.validateToken).toHaveBeenCalledWith({
      authToken: 'access-token',
    });
    expect(request.user).toEqual(user);
  });
});
