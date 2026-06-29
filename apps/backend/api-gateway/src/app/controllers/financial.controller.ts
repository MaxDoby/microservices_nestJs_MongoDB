import {
  Body,
  Controller,
  Post,
  Headers,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import {
  TransactionResponse,
  FinancialReportResponse,
} from '@financial-tracker/contracts';
import { GetFinancialReportQueryDto } from '../dto/get-financial-report-query.dto';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { PdfHttpResponse } from '@financial-tracker/types';
import { map, Observable } from 'rxjs';
import { ApiGatewayService } from '../api-gateway.service';

@Controller('transactions')
export class FinancialController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Post()
  createTransaction(
    @Headers('authorization') authorizationHeader: string | undefined,
    @Body() body: CreateTransactionDto,
  ): Observable<TransactionResponse> {
    return this.apiGatewayService.createTransactionForCurrentUser(
      authorizationHeader,
      body,
    );
  }

  @Get('report')
  getFinancialReport(
    @Headers('authorization') authorizationHeader: string | undefined,
    @Query() query: GetFinancialReportQueryDto,
  ): Observable<FinancialReportResponse> {
    return this.apiGatewayService.getFinancialReportForCurrentUser(
      authorizationHeader,
      query,
    );
  }

  @Get('report/pdf')
  getFinancialReportPdf(
    @Headers('authorization') authorizationHeader: string | undefined,
    @Query() query: GetFinancialReportQueryDto,
    @Res() response: PdfHttpResponse,
  ): Observable<void> {
    return this.apiGatewayService
      .generateFinancialReportPdfForCurrentUser(authorizationHeader, query)
      .pipe(
        map((pdf) => {
          const pdfBuffer = Buffer.from(pdf.contentBase64, 'base64');

          response.setHeader('Content-Type', pdf.mimeType);
          response.setHeader(
            'Content-Disposition',
            `attachment; filename="${pdf.fileName}"`,
          );

          response.send(pdfBuffer);
        }),
      );
  }

  @Get()
  getTransactions(
    @Headers('authorization') authorizationHeader: string | undefined,
  ): Observable<TransactionResponse[]> {
    return this.apiGatewayService.getTransactionsForCurrentUser(
      authorizationHeader,
    );
  }
}
