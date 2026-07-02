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
  CreateTransactionRequest,
  DeleteTransactionsRequest,
  DeleteTransactionsResponse,
  FINANCIAL_PATTERNS,
  GetTransactionsRequest,
  LoginRequest,
  PaginatedTransactionsResponse,
  RegisterRequest,
  TransactionResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
  FinancialReportResponse,
  GetFinancialReportRequest,
  GenerateFinancialReportPdfRequest,
  GenerateFinancialReportPdfResponse,
  PDF_PATTERNS,
  JwtPayload,
  RefreshTokenRequest,
  LogoutRequest,
  LogoutResponse,
  AUDIT_PATTERNS,
  CreateAuditLogRequest,
  AuditLogResponse,
} from '@financial-tracker/contracts';
import { catchError, Observable, switchMap, map } from 'rxjs';
import { GetFinancialReportQueryDto } from './dto/get-financial-report-query.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { buildCreateTransactionRequest } from './mappers/transaction.mapper';
import {
  buildCreateTransactionAuditLog,
  buildDeleteTransactionsAuditLog,
  buildGenerateReportAuditLog,
} from './mappers/audit.mapper';
import { GetTransactionsQueryDto } from './dto/get-transactions-query.dto';
import { DeleteTransactionsDto } from './dto/delete-transactions.dto';

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
    @Inject('AUDIT_SERVICE') private readonly auditClient: ClientProxy,
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

  refreshToken(payload: RefreshTokenRequest): Observable<AuthResponse> {
    return this.authClient
      .send<
        AuthResponse,
        RefreshTokenRequest
      >(AUTH_PATTERNS.REFRESH_TOKEN, payload)
      .pipe(catchError((error: RpcError) => this.handleRpcError(error)));
  }

  logout(payload: LogoutRequest): Observable<LogoutResponse> {
    return this.authClient
      .send<LogoutResponse, LogoutRequest>(AUTH_PATTERNS.LOGOUT, payload)
      .pipe(catchError((error: RpcError) => this.handleRpcError(error)));
  }

  private handleRpcError(error: RpcError): never {
    throw new HttpException(
      error.message ?? 'Internal server error',
      error.statusCode ?? 500,
    );
  }

  private validateDateRange(query: GetFinancialReportQueryDto): void {
    if (query.startDate > query.endDate) {
      throw new BadRequestException(
        'startDate must be before or equal to endDate.',
      );
    }
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
  ): Observable<PaginatedTransactionsResponse> {
    return this.financialClient
      .send<
        PaginatedTransactionsResponse,
        GetTransactionsRequest
      >(FINANCIAL_PATTERNS.GET_TRANSACTIONS, payload)
      .pipe(catchError((error: RpcError) => this.handleRpcError(error)));
  }

  deleteTransactions(
    payload: DeleteTransactionsRequest,
  ): Observable<DeleteTransactionsResponse> {
    return this.financialClient
      .send<
        DeleteTransactionsResponse,
        DeleteTransactionsRequest
      >(FINANCIAL_PATTERNS.DELETE_TRANSACTIONS, payload)
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
    user: JwtPayload,
    body: CreateTransactionDto,
  ): Observable<TransactionResponse> {
    return this.createTransaction(
      buildCreateTransactionRequest(user.sub, body),
    ).pipe(
      switchMap((transaction) =>
        this.createAuditLog(
          buildCreateTransactionAuditLog(user, transaction),
        ).pipe(map(() => transaction)),
      ),
    );
  }

  getTransactionsForCurrentUser(
    user: JwtPayload,
    query: GetTransactionsQueryDto,
  ): Observable<PaginatedTransactionsResponse> {
    return this.getTransactions({
      page: query.page,
      limit: query.limit,
    });
  }

  deleteTransactionsForCurrentUser(
    user: JwtPayload,
    body: DeleteTransactionsDto,
  ): Observable<DeleteTransactionsResponse> {
    return this.deleteTransactions({
      transactionIds: body.transactionIds,
    }).pipe(
      switchMap((deleteResult) =>
        this.createAuditLog(
          buildDeleteTransactionsAuditLog(user, body, deleteResult),
        ).pipe(map(() => deleteResult)),
      ),
    );
  }

  getFinancialReportForCurrentUser(
    user: JwtPayload,
    query: GetFinancialReportQueryDto,
  ): Observable<FinancialReportResponse> {
    this.validateDateRange(query);

    return this.getFinancialReport({
      userId: user.sub,
      period: {
        type: query.period,
        startDate: query.startDate,
        endDate: query.endDate,
      },
    }).pipe(
      switchMap((report) =>
        this.createAuditLog(buildGenerateReportAuditLog(user, report)).pipe(
          map(() => report),
        ),
      ),
    );
  }

  generateFinancialReportPdfForCurrentUser(
    user: JwtPayload,
    query: GetFinancialReportQueryDto,
  ): Observable<GenerateFinancialReportPdfResponse> {
    return this.getFinancialReportForCurrentUser(user, query).pipe(
      switchMap((report) =>
        this.generateFinancialReportPdf({
          userId: report.userId,
          report,
        }),
      ),
    );
  }

  createAuditLog(payload: CreateAuditLogRequest): Observable<AuditLogResponse> {
    return this.auditClient
      .send<
        AuditLogResponse,
        CreateAuditLogRequest
      >(AUDIT_PATTERNS.CREATE_LOG, payload)
      .pipe(catchError((error: RpcError) => this.handleRpcError(error)));
  }
}
