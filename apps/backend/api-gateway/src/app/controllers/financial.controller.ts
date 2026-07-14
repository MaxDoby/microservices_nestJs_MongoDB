import {
  Body,
  Controller,
  Delete,
  Post,
  UseGuards,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import {
  TransactionResponse,
  FinancialReportResponse,
  PaginatedTransactionsResponse,
  DeleteTransactionsResponse,
  JwtPayload,
} from '@financial-tracker/contracts';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guards';
import { CurrentUser } from '../decorators/current-user.decorator';
import { GetFinancialReportQueryDto } from '../dto/get-financial-report-query.dto';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { DeleteTransactionsDto } from '../dto/delete-transactions.dto';
import { GetTransactionsQueryDto } from '../dto/get-transactions-query.dto';
import { PdfHttpResponse } from '../types/http-response.types';
import { map, Observable } from 'rxjs';
import { ApiGatewayService } from '../api-gateway.service';
import {
  DeleteTransactionsResponseDto,
  ErrorResponseDto,
  FinancialReportResponseDto,
  PaginatedTransactionsResponseDto,
  TransactionResponseDto,
} from '../dto/api-docs.dto';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('transactions')
export class FinancialController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @ApiOperation({
    summary: 'Create a transaction',
    description:
      'Creates an income or expense transaction. The authenticated user id is stored as the transaction creator for audit purposes.',
  })
  @ApiBody({
    type: CreateTransactionDto,
    description: 'Transaction data to be saved in the financial service.',
  })
  @ApiCreatedResponse({
    description: 'Transaction created successfully.',
    type: TransactionResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Invalid authorization header, invalid body or incompatible type/category pair.',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Bearer token is invalid or expired.',
    type: ErrorResponseDto,
  })
  @Post()
  createTransaction(
    @CurrentUser() user: JwtPayload,
    @Body() body: CreateTransactionDto,
  ): Observable<TransactionResponse> {
    return this.apiGatewayService.createTransactionForCurrentUser(user, body);
  }

  @ApiOperation({
    summary: 'Generate financial report',
    description:
      'Returns calculated revenue, expense, VAT, payroll and profit data across all transactions for the requested period.',
  })
  @ApiQuery({
    name: 'period',
    enum: ['monthly', 'quarterly', 'annual'],
    description: 'Requested report aggregation period.',
    example: 'annual',
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Inclusive report start date in ISO format.',
    example: '2026-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    description: 'Inclusive report end date in ISO format.',
    example: '2026-12-31',
  })
  @ApiOkResponse({
    description: 'Financial report generated successfully.',
    type: FinancialReportResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Invalid authorization header, invalid query or invalid date range.',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Bearer token is invalid or expired.',
    type: ErrorResponseDto,
  })
  @Get('report')
  getFinancialReport(
    @CurrentUser() user: JwtPayload,
    @Query() query: GetFinancialReportQueryDto,
  ): Observable<FinancialReportResponse> {
    return this.apiGatewayService.getFinancialReportForCurrentUser(
      user,
      query,
    );
  }

  @ApiOperation({
    summary: 'Download financial report as PDF',
    description:
      'Generates the same financial report as a PDF document and returns it as an application/pdf response.',
  })
  @ApiQuery({
    name: 'period',
    enum: ['monthly', 'quarterly', 'annual'],
    description: 'Requested report aggregation period.',
    example: 'annual',
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Inclusive report start date in ISO format.',
    example: '2026-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    description: 'Inclusive report end date in ISO format.',
    example: '2026-12-31',
  })
  @ApiProduces('application/pdf')
  @ApiOkResponse({
    description: 'PDF report generated successfully.',
    content: {
      'application/pdf': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'Invalid authorization header, invalid query or invalid date range.',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Bearer token is invalid or expired.',
    type: ErrorResponseDto,
  })
  @Get('report/pdf')
  getFinancialReportPdf(
    @CurrentUser() user: JwtPayload,
    @Query() query: GetFinancialReportQueryDto,
    @Res() response: PdfHttpResponse,
  ): Observable<void> {
    return this.apiGatewayService
      .generateFinancialReportPdfForCurrentUser(user, query)
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

  @ApiOperation({
    summary: 'List user transactions',
    description:
      'Returns all transactions available in the accounting workspace. Authentication is required, but the list is not filtered by user.',
  })
  @ApiOkResponse({
    description: 'Transactions loaded successfully.',
    type: PaginatedTransactionsResponseDto,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number used for transaction pagination.',
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of transactions returned per page.',
    example: 20,
    required: false,
  })
  @ApiBadRequestResponse({
    description: 'Authorization header is missing or malformed.',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Bearer token is invalid or expired.',
    type: ErrorResponseDto,
  })
  @Get()
  getTransactions(
    @CurrentUser() user: JwtPayload,
    @Query() query: GetTransactionsQueryDto,
  ): Observable<PaginatedTransactionsResponse> {
    return this.apiGatewayService.getTransactionsForCurrentUser(
      user,
      query,
    );
  }

  @ApiOperation({
    summary: 'Delete selected transactions',
    description:
      'Deletes one or more selected transactions from the accounting workspace. Authentication is required, but deletion is not filtered by user.',
  })
  @ApiOkResponse({
    description: 'Transactions deleted successfully.',
    type: DeleteTransactionsResponseDto,
  })
  @ApiBody({
    type: DeleteTransactionsDto,
    description: 'Ids selected by the user for deletion.',
  })
  @ApiBadRequestResponse({
    description:
      'Authorization header is missing, body is invalid or no transaction ids were provided.',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Bearer token is invalid or expired.',
    type: ErrorResponseDto,
  })
  @Delete()
  deleteTransactions(
    @CurrentUser() user: JwtPayload,
    @Body() body: DeleteTransactionsDto,
  ): Observable<DeleteTransactionsResponse> {
    return this.apiGatewayService.deleteTransactionsForCurrentUser(
      user,
      body,
    );
  }
}
