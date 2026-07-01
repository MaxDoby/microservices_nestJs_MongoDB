import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import {
  AuthResponse,
  JwtPayload,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  LogoutRequest,
  LogoutResponse,
  ValidateTokenResponse,
  ValidateTokenRequest,
} from '@financial-tracker/contracts';
import * as bcrypt from 'bcrypt';
import { UserDocument } from './schemas/user.schema';
import { toAuthResponse, toJwtPayload } from './mappers/auth.mapper';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(payload.email);

    if (existingUser) {
      throw new RpcException({
        statusCode: 409,
        message: 'User with this email already exists.',
      });
    }

    const saltRounds = Number(
      this.configService.getOrThrow<string>('BCRYPT_SALT_ROUNDS'),
    );

    const hashedPass = await bcrypt.hash(payload.password, saltRounds);

    const user = await this.userRepository.create({
      name: payload.name,
      surname: payload.surname,
      email: payload.email,
      password: hashedPass,
    });

    return this.buildAuthResponse(user);
  }

  async login(payload: LoginRequest): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(payload.email);

    if (!user) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid email or password.',
      });
    }

    const isPasswordValid = await bcrypt.compare(
      payload.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid email or password.',
      });
    }

    return this.buildAuthResponse(user);
  }

  private signAccessToken(user: UserDocument): string {
    return this.jwtService.sign(toJwtPayload(user, 'access'));
  }

  private signRefreshToken(user: UserDocument): string {
    return this.jwtService.sign(toJwtPayload(user, 'refresh'), {
      expiresIn: '7d',
    });
  }

  async validateToken(
    payload: ValidateTokenRequest,
  ): Promise<ValidateTokenResponse> {
    try {
      const user = await this.jwtService.verifyAsync<JwtPayload>(
        payload.authToken,
      );

      if (user.type !== 'access') {
        throw new Error('Invalid token type.');
      }

      return {
        isValid: true,
        user,
      };
    } catch {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  async refreshToken(payload: RefreshTokenRequest): Promise<AuthResponse> {
    const user = await this.getUserByValidRefreshToken(payload.refreshToken);

    return this.buildAuthResponse(user);
  }

  async logout(payload: LogoutRequest): Promise<LogoutResponse> {
    const user = await this.getUserByValidRefreshToken(payload.refreshToken);

    await this.userRepository.clearRefreshTokenHash(user.id);

    return { success: true };
  }

  private async getUserByValidRefreshToken(
    refreshToken: string,
  ): Promise<UserDocument> {
    try {
      const tokenPayload =
        await this.jwtService.verifyAsync<JwtPayload>(refreshToken);

      if (tokenPayload.type !== 'refresh') {
        throw new Error('Invalid token type.');
      }

      const user = await this.userRepository.findById(tokenPayload.sub);

      if (!user?.refreshTokenHash) {
        throw new Error('Refresh token not found.');
      }

      const isRefreshTokenValid = await bcrypt.compare(
        refreshToken,
        user.refreshTokenHash,
      );

      if (!isRefreshTokenValid) {
        throw new Error('Invalid refresh token.');
      }

      return user;
    } catch {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired refresh token.',
      });
    }
  }

  private async buildAuthResponse(user: UserDocument): Promise<AuthResponse> {
    const accessToken = this.signAccessToken(user);
    const refreshToken = this.signRefreshToken(user);

    const saltRounds = Number(
      this.configService.getOrThrow<string>('BCRYPT_SALT_ROUNDS'),
    );

    const refreshTokenHash = await bcrypt.hash(refreshToken, saltRounds);

    await this.userRepository.updateRefreshTokenHash(user.id, refreshTokenHash);

    return toAuthResponse(user, accessToken, refreshToken);
  }
}
