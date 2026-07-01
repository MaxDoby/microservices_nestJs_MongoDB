import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AUTH_PATTERNS,
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  ValidateTokenRequest,
  ValidateTokenResponse,
  LogoutRequest,
  LogoutResponse,
} from '@financial-tracker/contracts';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_PATTERNS.REGISTER)
  async register(@Payload() payload: RegisterRequest): Promise<AuthResponse> {
    return this.authService.register(payload);
  }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  async login(@Payload() payload: LoginRequest): Promise<AuthResponse> {
    return this.authService.login(payload);
  }

  @MessagePattern(AUTH_PATTERNS.VALIDATE_TOKEN)
  async validateToken(
    @Payload() payload: ValidateTokenRequest,
  ): Promise<ValidateTokenResponse> {
    return this.authService.validateToken(payload);
  }

  @MessagePattern(AUTH_PATTERNS.LOGOUT)
  async logout(@Payload() payload: LogoutRequest): Promise<LogoutResponse> {
    return this.authService.logout(payload);
  }

  @MessagePattern(AUTH_PATTERNS.REFRESH_TOKEN)
  async refreshToken(
    @Payload() payload: RefreshTokenRequest,
  ): Promise<AuthResponse> {
    return this.authService.refreshToken(payload);
  }
}
