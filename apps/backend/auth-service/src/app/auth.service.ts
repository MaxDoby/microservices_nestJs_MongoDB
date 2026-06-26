import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { RpcException } from '@nestjs/microservices';
import {
  AuthResponse,
  JwtPayload,
  LoginRequest,
  RegisterRequest,
} from '@financial-tracker/contracts';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import {
  ValidateTokenResponse,
  ValidateTokenRequest,
} from '@financial-tracker/contracts';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const existingUser = await this.userModel.findOne({ email: payload.email });

    if (existingUser) {
      throw new RpcException({
        statusCode: 409,
        message: 'User with this email already exists.',
      });
    }

    const hashedPass = await bcrypt.hash(payload.password, 10);

    const user = await this.userModel.create({
      name: payload.name,
      surname: payload.surname,
      email: payload.email,
      password: hashedPass,
    });

    return {
      authToken: this.signAuthToken(user),
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
      },
    };
  }

  async login(payload: LoginRequest): Promise<AuthResponse> {
    const user = await this.userModel.findOne({ email: payload.email });

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

    return {
      authToken: this.signAuthToken(user),
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
      },
    };
  }

  private signAuthToken(user: UserDocument): string {
    const jwtPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.sign(jwtPayload);
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
