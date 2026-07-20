import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  AuthResponse,
  LogoutResponse,
  ValidateTokenResponse,
} from '@financial-tracker/contracts';
import { Observable } from 'rxjs';
import { ApiGatewayService } from '../api-gateway.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { ValidateTokenDto } from '../dto/validate-token.dto';
import {
  AuthControllerDocs,
  LoginDocs,
  LogoutDocs,
  RefreshTokenDocs,
  RegisterDocs,
  ValidateTokenDocs,
} from '../docs/auth.docs';

@AuthControllerDocs()
@Controller('auth')
export class AuthController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @RegisterDocs()
  @Post('register')
  register(@Body() body: RegisterDto): Observable<AuthResponse> {
    return this.apiGatewayService.register(body);
  }

  @LoginDocs()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() body: LoginDto): Observable<AuthResponse> {
    return this.apiGatewayService.login(body);
  }

  @LogoutDocs()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Body() body: RefreshTokenDto): Observable<LogoutResponse> {
    return this.apiGatewayService.logout(body);
  }

  @RefreshTokenDocs()
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  refreshToken(@Body() body: RefreshTokenDto): Observable<AuthResponse> {
    return this.apiGatewayService.refreshToken(body);
  }

  @ValidateTokenDocs()
  @HttpCode(HttpStatus.OK)
  @Post('validate-token')
  validateToken(
    @Body() body: ValidateTokenDto,
  ): Observable<ValidateTokenResponse> {
    return this.apiGatewayService.validateToken(body);
  }
}
