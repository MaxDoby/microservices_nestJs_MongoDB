import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
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
  FinancialReportResponse,
  GetFinancialReportRequest,
  GenerateFinancialReportPdfRequest,
  GenerateFinancialReportPdfResponse,
  PDF_PATTERNS,
  JwtPayload,
} from '@financial-tracker/contracts';
import { catchError, map, Observable, switchMap } from 'rxjs';
import { GetFinancialReportQueryDto } from './dto/get-financial-report-query.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { buildCreateTransactionRequest } from './mappers/transaction.mapper';

type RpcError = {
  message?: string;
  statusCode?: number;
};

@Injectable()
export class ApiGatewayService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('FINANCIAL_SERVICE') private readonly financialClient: ClientProxy,
    @Inject('PDF_SERVICE') private readonly pdfClient: ClientProxy,
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

  private getAuthToken(authorizationHeader?: string): string {
    if (!authorizationHeader?.startsWith('Bearer ')) {
      throw new BadRequestException(
        'Authorization header must be Bearer token.',
      );
    }

    return authorizationHeader.replace('Bearer ', '');
  }

  private validateDateRange(query: GetFinancialReportQueryDto): void {
    if (query.startDate > query.endDate) {
      throw new BadRequestException(
        'startDate must be before or equal to endDate.',
      );
    }
  }

  private getCurrentUser(
    authorizationHeader: string | undefined,
  ): Observable<JwtPayload> {
    const authToken = this.getAuthToken(authorizationHeader);

    return this.validateToken({ authToken }).pipe(
      map((response) => response.user),
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

  getFinancialReport(
    payload: GetFinancialReportRequest,
  ): Observable<FinancialReportResponse> {
    return this.financialClient
      .send<
        FinancialReportResponse,
        GetFinancialReportRequest
      >(FINANCIAL_PATTERNS.GET_REPORT, payload)
      .pipe(catchError((error: RpcError) => this.handleRpcError(error)));
  }

  generateFinancialReportPdf(
    payload: GenerateFinancialReportPdfRequest,
  ): Observable<GenerateFinancialReportPdfResponse> {
    return this.pdfClient
      .send<
        GenerateFinancialReportPdfResponse,
        GenerateFinancialReportPdfRequest
      >(PDF_PATTERNS.GENERATE_FINANCIAL_REPORT, payload)
      .pipe(catchError((error) => this.handleRpcError(error)));
  }

  createTransactionForCurrentUser(
    authorizationHeader: string | undefined,
    body: CreateTransactionDto,
  ): Observable<TransactionResponse> {
    return this.getCurrentUser(authorizationHeader).pipe(
      switchMap((user) =>
        this.createTransaction(buildCreateTransactionRequest(user.sub, body)),
      ),
    );
  }

  getTransactionsForCurrentUser(
    authorizationHeader: string | undefined,
  ): Observable<TransactionResponse[]> {
    return this.getCurrentUser(authorizationHeader).pipe(
      switchMap((user) =>
        this.getTransactions({
          userId: user.sub,
        }),
      ),
    );
  }

  getFinancialReportForCurrentUser(
    authorizationHeader: string | undefined,
    query: GetFinancialReportQueryDto,
  ): Observable<FinancialReportResponse> {
    this.validateDateRange(query);

    return this.getCurrentUser(authorizationHeader).pipe(
      switchMap((user) =>
        this.getFinancialReport({
          userId: user.sub,
          period: {
            type: query.period,
            startDate: query.startDate,
            endDate: query.endDate,
          },
        }),
      ),
    );
  }

  generateFinancialReportPdfForCurrentUser(
    authorizationHeader: string | undefined,
    query: GetFinancialReportQueryDto,
  ): Observable<GenerateFinancialReportPdfResponse> {
    return this.getFinancialReportForCurrentUser(
      authorizationHeader,
      query,
    ).pipe(
      switchMap((report) =>
        this.generateFinancialReportPdf({
          userId: report.userId,
          report,
        }),
      ),
    );
  }
}
