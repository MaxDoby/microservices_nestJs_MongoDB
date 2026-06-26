import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AUTH_PATTERNS,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  CreateTransactionRequest,
  FINANCIAL_PATTERNS,
  GetTransactionsRequest,
  TransactionResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
} from '@financial-tracker/contracts';
import { catchError, Observable } from 'rxjs';

type RpcError = {
  message?: string;
  statusCode?: number;
};

@Injectable()
export class ApiGatewayService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('FINANCIAL_SERVICE') private readonly financialClient: ClientProxy,
  ) {}

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.authClient
      .send<AuthResponse, RegisterRequest>(AUTH_PATTERNS.REGISTER, payload)
      .pipe(catchError((error: RpcError) => this.handleRpcError(error)));
  }

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.authClient
      .send<AuthResponse, LoginRequest>(AUTH_PATTERNS.LOGIN, payload)
      .pipe(catchError((error: RpcError) => this.handleRpcError(error)));
  }

  private handleRpcError(error: RpcError): never {
    throw new HttpException(
      error.message ?? 'Internal server error',
      error.statusCode ?? 500,
    );
  }

  validateToken(
    payload: ValidateTokenRequest,
  ): Observable<ValidateTokenResponse> {
    return this.authClient
      .send<
        ValidateTokenResponse,
        ValidateTokenRequest
      >(AUTH_PATTERNS.VALIDATE_TOKEN, payload)
      .pipe(catchError((error) => this.handleRpcError(error)));
  }

  createTransaction(
    payload: CreateTransactionRequest,
  ): Observable<TransactionResponse> {
    return this.financialClient
      .send<
        TransactionResponse,
        CreateTransactionRequest
      >(FINANCIAL_PATTERNS.CREATE_TRANSACTION, payload)
      .pipe(catchError((error: RpcError) => this.handleRpcError(error)));
  }

  getTransactions(
    payload: GetTransactionsRequest,
  ): Observable<TransactionResponse[]> {
    return this.financialClient
      .send(FINANCIAL_PATTERNS.GET_TRANSACTIONS, payload)
      .pipe(catchError((error: RpcError) => this.handleRpcError(error)));
  }
}
