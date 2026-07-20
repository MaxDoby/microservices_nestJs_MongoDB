import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  DeleteTransactionsResponse,
  FinancialReportResponse,
  JwtPayload,
  PaginatedTransactionsResponse,
  TransactionResponse,
} from '@financial-tracker/contracts';
import { map, Observable } from 'rxjs';
import { ApiGatewayService } from '../api-gateway.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guards';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { DeleteTransactionsDto } from '../dto/delete-transactions.dto';
import { GetFinancialReportQueryDto } from '../dto/get-financial-report-query.dto';
import { GetTransactionsQueryDto } from '../dto/get-transactions-query.dto';
import { PdfHttpResponse } from '../types/http-response.types';
import { sendPdfResponse } from '../http/pdf-response.sender';
import {
  CreateTransactionDocs,
  DeleteTransactionsDocs,
  FinancialControllerDocs,
  GetFinancialReportDocs,
  GetFinancialReportPdfDocs,
  GetTransactionsDocs,
} from '../docs/financial.docs';

@FinancialControllerDocs()
@UseGuards(AuthGuard)
@Controller('transactions')
export class FinancialController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @CreateTransactionDocs()
  @Post()
  createTransaction(
    @CurrentUser() user: JwtPayload,
    @Body() body: CreateTransactionDto,
  ): Observable<TransactionResponse> {
    return this.apiGatewayService.createTransactionForCurrentUser(user, body);
  }

  @GetFinancialReportDocs()
  @Get('report')
  getFinancialReport(
    @CurrentUser() user: JwtPayload,
    @Query() query: GetFinancialReportQueryDto,
  ): Observable<FinancialReportResponse> {
    return this.apiGatewayService.getFinancialReportForCurrentUser(user, query);
  }

  @GetFinancialReportPdfDocs()
  @Get('report/pdf')
  getFinancialReportPdf(
    @CurrentUser() user: JwtPayload,
    @Query() query: GetFinancialReportQueryDto,
    @Res() response: PdfHttpResponse,
  ): Observable<void> {
    return this.apiGatewayService
      .generateFinancialReportPdfForCurrentUser(user, query)
      .pipe(map((pdf) => sendPdfResponse(response, pdf)));
  }

  @GetTransactionsDocs()
  @Get()
  getTransactions(
    @CurrentUser() user: JwtPayload,
    @Query() query: GetTransactionsQueryDto,
  ): Observable<PaginatedTransactionsResponse> {
    return this.apiGatewayService.getTransactionsForCurrentUser(user, query);
  }

  @DeleteTransactionsDocs()
  @Delete()
  deleteTransactions(
    @CurrentUser() user: JwtPayload,
    @Body() body: DeleteTransactionsDto,
  ): Observable<DeleteTransactionsResponse> {
    return this.apiGatewayService.deleteTransactionsForCurrentUser(user, body);
  }
}
