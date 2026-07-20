import { applyDecorators } from '@nestjs/common';
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
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { ValidateTokenDto } from '../dto/validate-token.dto';
import {
  AuthResponseDto,
  ErrorResponseDto,
  LogoutResponseDto,
  ValidateTokenResponseDto,
} from '../dto/api-docs.dto';

export const AuthControllerDocs = () => applyDecorators(ApiTags('Auth'));

export const RegisterDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Register a new user',
      description:
        'Creates a new user account, hashes the password inside auth-service and returns a JWT token with the public user profile.',
    }),
    ApiBody({
      type: RegisterDto,
      description: 'Registration data required to create a new account.',
    }),
    ApiCreatedResponse({
      description: 'User registered successfully.',
      type: AuthResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Request body failed validation.',
      type: ErrorResponseDto,
    }),
    ApiConflictResponse({
      description: 'A user with the same email already exists.',
      type: ErrorResponseDto,
    }),
  );

export const LoginDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Login an existing user',
      description:
        'Authenticates the user by email and password and returns a JWT token for protected endpoints.',
    }),
    ApiBody({
      type: LoginDto,
      description: 'Login credentials.',
    }),
    ApiOkResponse({
      description: 'User authenticated successfully.',
      type: AuthResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Request body failed validation.',
      type: ErrorResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Email or password is invalid.',
      type: ErrorResponseDto,
    }),
  );

export const LogoutDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Logout user',
      description:
        'Invalidates the stored refresh token hash and clears the active refresh session.',
    }),
    ApiBody({
      type: RefreshTokenDto,
      description: 'Refresh token payload used to identify the session.',
    }),
    ApiOkResponse({
      description: 'User logged out successfully.',
      type: LogoutResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Request body failed validation.',
      type: ErrorResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Refresh token is invalid or expired.',
      type: ErrorResponseDto,
    }),
  );

export const RefreshTokenDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Refresh access token',
      description:
        'Uses a valid refresh token to issue a new access token and refresh token pair.',
    }),
    ApiBody({
      type: RefreshTokenDto,
      description: 'Refresh token payload.',
    }),
    ApiOkResponse({
      description: 'Token pair refreshed successfully.',
      type: AuthResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Request body failed validation.',
      type: ErrorResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Refresh token is invalid or expired.',
      type: ErrorResponseDto,
    }),
  );

export const ValidateTokenDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Validate a JWT token',
      description:
        'Checks whether a JWT token is still valid and returns the decoded token payload.',
    }),
    ApiBody({
      type: ValidateTokenDto,
      description: 'Token validation payload.',
    }),
    ApiOkResponse({
      description: 'Token is valid.',
      type: ValidateTokenResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Request body failed validation.',
      type: ErrorResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token is invalid or expired.',
      type: ErrorResponseDto,
    }),
  );
