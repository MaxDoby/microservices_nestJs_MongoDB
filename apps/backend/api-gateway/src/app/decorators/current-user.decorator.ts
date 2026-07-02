import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload } from '@financial-tracker/contracts';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtPayload => {
    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();

    if (!request.user) {
      throw new UnauthorizedException('Authenticated user not found.');
    }

    return request.user;
  },
);
