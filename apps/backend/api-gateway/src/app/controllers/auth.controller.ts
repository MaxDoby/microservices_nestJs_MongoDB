import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  AuthResponse,
  ValidateTokenResponse,
} from '@financial-tracker/contracts';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { ValidateTokenDto } from '../dto/validate-token.dto';
import { Observable } from 'rxjs';
import { ApiGatewayService } from '../api-gateway.service';
import {
  AuthResponseDto,
  ErrorResponseDto,
  ValidateTokenResponseDto,
} from '../dto/api-docs.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account, hashes the password inside auth-service and returns a JWT token with the public user profile.',
  })
  @ApiBody({
    type: RegisterDto,
    description: 'Registration data required to create a new account.',
  })
  @ApiCreatedResponse({
    description: 'User registered successfully.',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request body failed validation.',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'A user with the same email already exists.',
    type: ErrorResponseDto,
  })
  @Post('register')
  register(@Body() body: RegisterDto): Observable<AuthResponse> {
    return this.apiGatewayService.register(body);
  }

  @ApiOperation({
    summary: 'Login an existing user',
    description:
      'Authenticates the user by email and password and returns a JWT token for protected endpoints.',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Login credentials.',
  })
  @ApiOkResponse({
    description: 'User authenticated successfully.',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request body failed validation.',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Email or password is invalid.',
    type: ErrorResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() body: LoginDto): Observable<AuthResponse> {
    return this.apiGatewayService.login(body);
  }

  @ApiOperation({
    summary: 'Validate a JWT token',
    description:
      'Checks whether a JWT token is still valid and returns the decoded token payload.',
  })
  @ApiBody({
    type: ValidateTokenDto,
    description: 'Token validation payload.',
  })
  @ApiOkResponse({
    description: 'Token is valid.',
    type: ValidateTokenResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request body failed validation.',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token is invalid or expired.',
    type: ErrorResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('validate-token')
  validateToken(
    @Body() body: ValidateTokenDto,
  ): Observable<ValidateTokenResponse> {
    return this.apiGatewayService.validateToken(body);
  }
}
