import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { JwtPayload } from '@financial-tracker/contracts';
import { ApiGatewayService } from '../api-gateway.service';

type RequestWithUser = {
  headers: {
    authorization: string;
  };
  user?: JwtPayload;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader?.startsWith('Bearer ')) {
      throw new BadRequestException(
        'Authorization header must be Bearer token.',
      );
    }

    const authToken = authorizationHeader.replace('Bearer ', '');
    const response = await lastValueFrom(
      this.apiGatewayService.validateToken({ authToken }),
    );

    request.user = response.user;

    return true;
  }
}
