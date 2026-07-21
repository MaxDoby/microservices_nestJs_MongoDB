import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  ValidateTokenRequest,
} from '@financial-tracker/contracts';
import { AuthService } from './auth.service';
import { UserRepository } from './repositories/user.repository';
import { UserDocument } from './schemas/user.schema';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const buildUser = (user: Partial<UserDocument>): UserDocument => {
  return user as UserDocument;
};

describe('AuthService', () => {
  let service: AuthService;

  const userRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    updateRefreshTokenHash: jest.fn(),
    clearRefreshTokenHash: jest.fn(),
  };

  const jwtService = {
    sign: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const configService = {
    getOrThrow: jest.fn(),
  };

  const hashMock = bcrypt.hash as unknown as jest.Mock;
  const compareMock = bcrypt.compare as unknown as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    configService.getOrThrow.mockReturnValue('12');

    service = new AuthService(
      userRepository as unknown as UserRepository,
      jwtService as unknown as JwtService,
      configService as unknown as ConfigService,
    );
  });

  it('registers a new user and returns auth response', async () => {
    const payload: RegisterRequest = {
      name: 'Max',
      surname: 'Dobinda',
      email: 'max@max.com',
      password: 'password1',
    };

    const user = buildUser({
      id: '6a426f90fcc2f5e584cb060a',
      name: 'Max',
      surname: 'Dobinda',
      email: 'max@max.com',
      password: 'hashed-password',
    });

    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(user);
    jwtService.sign
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');
    hashMock
      .mockResolvedValueOnce('hashed-password')
      .mockResolvedValueOnce('hashed-refresh-token');
    userRepository.updateRefreshTokenHash.mockResolvedValue({});

    const result = await service.register(payload);

    expect(userRepository.findByEmail).toHaveBeenCalledWith('max@max.com');
    expect(hashMock).toHaveBeenCalledWith('password1', 12);
    expect(userRepository.create).toHaveBeenCalledWith({
      name: 'Max',
      surname: 'Dobinda',
      email: 'max@max.com',
      password: 'hashed-password',
    });
    expect(userRepository.updateRefreshTokenHash).toHaveBeenCalledWith(
      '6a426f90fcc2f5e584cb060a',
      'hashed-refresh-token',
    );
    expect(result).toEqual({
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

  it('throws RpcException when registering duplicated email', async () => {
    const payload: RegisterRequest = {
      name: 'Max',
      surname: 'Dobinda',
      email: 'max@max.com',
      password: 'password1',
    };

    userRepository.findByEmail.mockResolvedValue(
      buildUser({
        id: '6a426f90fcc2f5e584cb060a',
        email: 'max@max.com',
      }),
    );

    await expect(service.register(payload)).rejects.toBeInstanceOf(
      RpcException,
    );

    expect(userRepository.create).not.toHaveBeenCalled();
    expect(hashMock).not.toHaveBeenCalled();
  });

  it('logs in existing user with valid password', async () => {
    const payload: LoginRequest = {
      email: 'max@max.com',
      password: 'password1',
    };

    const user = buildUser({
      id: '6a426f90fcc2f5e584cb060a',
      name: 'Max',
      surname: 'Dobinda',
      email: 'max@max.com',
      password: 'hashed-password',
    });

    userRepository.findByEmail.mockResolvedValue(user);
    compareMock.mockResolvedValue(true);
    jwtService.sign
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');
    hashMock.mockResolvedValue('hashed-refresh-token');
    userRepository.updateRefreshTokenHash.mockResolvedValue({});

    const result = await service.login(payload);

    expect(userRepository.findByEmail).toHaveBeenCalledWith('max@max.com');
    expect(compareMock).toHaveBeenCalledWith('password1', 'hashed-password');
    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(result.user.email).toBe('max@max.com');
  });

  it('throws RpcException when login user does not exist', async () => {
    const payload: LoginRequest = {
      email: 'missing@max.com',
      password: 'password1',
    };

    userRepository.findByEmail.mockResolvedValue(null);

    await expect(service.login(payload)).rejects.toBeInstanceOf(RpcException);

    expect(compareMock).not.toHaveBeenCalled();
  });

  it('validates access token', async () => {
    const payload: ValidateTokenRequest = {
      authToken: 'access-token',
    };

    jwtService.verifyAsync.mockResolvedValue({
      sub: '6a426f90fcc2f5e584cb060a',
      email: 'max@max.com',
      type: 'access',
    });

    const result = await service.validateToken(payload);

    expect(jwtService.verifyAsync).toHaveBeenCalledWith('access-token');
    expect(result).toEqual({
      isValid: true,
      user: {
        sub: '6a426f90fcc2f5e584cb060a',
        email: 'max@max.com',
        type: 'access',
      },
    });
  });

  it('refreshes auth response when refresh token is valid', async () => {
    const payload: RefreshTokenRequest = {
      refreshToken: 'old-refresh-token',
    };

    const user = buildUser({
      id: '6a426f90fcc2f5e584cb060a',
      name: 'Max',
      surname: 'Dobinda',
      email: 'max@max.com',
      password: 'hashed-password',
      refreshTokenHash: 'saved-refresh-token-hash',
    });

    jwtService.verifyAsync.mockResolvedValue({
      sub: '6a426f90fcc2f5e584cb060a',
      email: 'max@max.com',
      type: 'refresh',
    });
    userRepository.findById.mockResolvedValue(user);
    compareMock.mockResolvedValue(true);
    jwtService.sign
      .mockReturnValueOnce('new-access-token')
      .mockReturnValueOnce('new-refresh-token');
    hashMock.mockResolvedValue('new-refresh-token-hash');
    userRepository.updateRefreshTokenHash.mockResolvedValue({});

    const result = await service.refreshToken(payload);

    expect(userRepository.findById).toHaveBeenCalledWith(
      '6a426f90fcc2f5e584cb060a',
    );
    expect(compareMock).toHaveBeenCalledWith(
      'old-refresh-token',
      'saved-refresh-token-hash',
    );
    expect(result.accessToken).toBe('new-access-token');
    expect(result.refreshToken).toBe('new-refresh-token');
  });
});
