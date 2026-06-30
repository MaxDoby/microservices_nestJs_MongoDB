import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import {
  AuthResponse,
  JwtPayload,
  LoginRequest,
  RegisterRequest,
} from '@financial-tracker/contracts';
import * as bcrypt from 'bcrypt';
import { UserDocument } from './schemas/user.schema';
import { toAuthResponse, toJwtPayload } from './mappers/auth.mapper';
import { UserRepository } from './repositories/user.repository';
import {
  ValidateTokenResponse,
  ValidateTokenRequest,
} from '@financial-tracker/contracts';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(payload.email);

    if (existingUser) {
      throw new RpcException({
        statusCode: 409,
        message: 'User with this email already exists.',
      });
    }

    const hashedPass = await bcrypt.hash(payload.password, 10);

    const user = await this.userRepository.create({
      name: payload.name,
      surname: payload.surname,
      email: payload.email,
      password: hashedPass,
    });

    return toAuthResponse(user, this.signAuthToken(user));
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

    return toAuthResponse(user, this.signAuthToken(user));
  }

  private signAuthToken(user: UserDocument): string {
    return this.jwtService.sign(toJwtPayload(user));
  }

  async validateToken(
    payload: ValidateTokenRequest,
  ): Promise<ValidateTokenResponse> {
    try {
      const user = await this.jwtService.verifyAsync<JwtPayload>(
        payload.authToken,
      );

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
}
