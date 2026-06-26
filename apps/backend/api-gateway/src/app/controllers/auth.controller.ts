import { Body, Controller, Post } from '@nestjs/common';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '@financial-tracker/contracts';
import { Observable } from 'rxjs';
import { ApiGatewayService } from '../api-gateway.service';
import {
  ValidateTokenRequest,
  ValidateTokenResponse,
} from '@financial-tracker/contracts';

@Controller('auth')
export class AuthController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Post('register')
  register(@Body() body: RegisterRequest): Observable<AuthResponse> {
    return this.apiGatewayService.register(body);
  }

  @Post('login')
  login(@Body() body: LoginRequest): Observable<AuthResponse> {
    return this.apiGatewayService.login(body);
  }

  @Post('validate-token')
  validateToken(
    @Body() body: ValidateTokenRequest,
  ): Observable<ValidateTokenResponse> {
    return this.apiGatewayService.validateToken(body);
  }
}
