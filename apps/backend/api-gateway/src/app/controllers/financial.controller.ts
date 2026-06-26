import {
  Body,
  Controller,
  Post,
  BadRequestException,
  Headers,
  Get,
} from '@nestjs/common';
import {
  CreateTransactionRequest,
  JwtPayload,
  TransactionResponse,
} from '@financial-tracker/contracts';
import { map, Observable, switchMap } from 'rxjs';
import { ApiGatewayService } from '../api-gateway.service';

@Controller('transactions')
export class FinancialController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  private getAuthToken(authorizationHeader?: string): string {
    if (!authorizationHeader?.startsWith('Bearer ')) {
      throw new BadRequestException(
        'Authorization header must be Bearer token.',
      );
    }

    return authorizationHeader.replace('Bearer ', '');
  }

  @Post()
  createTransaction(
    @Headers('authorization') authorizationHeader: string | undefined,
    @Body() body: Omit<CreateTransactionRequest, 'userId'>,
  ): Observable<TransactionResponse> {
    const authToken = this.getAuthToken(authorizationHeader);

    return this.apiGatewayService.validateToken({ authToken }).pipe(
      map((response) => response.user),
      switchMap((user: JwtPayload) =>
        this.apiGatewayService.createTransaction({
          ...body,
          userId: user.sub,
        }),
      ),
    );
  }

  @Get()
  getTransactions(
    @Headers('authorization') authorizationHeader: string | undefined,
  ): Observable<TransactionResponse[]> {
    const authToken = this.getAuthToken(authorizationHeader);

    return this.apiGatewayService.validateToken({ authToken }).pipe(
      map((response) => response.user),
      switchMap((user: JwtPayload) =>
        this.apiGatewayService.getTransactions({
          userId: user.sub,
        }),
      ),
    );
  }
}
