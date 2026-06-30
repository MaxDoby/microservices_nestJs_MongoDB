import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateTransactionRequest,
  DeleteTransactionsRequest,
  DeleteTransactionsResponse,
  FINANCIAL_PATTERNS,
  GetTransactionsRequest,
  PaginatedTransactionsResponse,
  TransactionResponse,
  FinancialReportResponse,
  GetFinancialReportRequest,
} from '@financial-tracker/contracts';
import { FinancialService } from './financial.service';

@Controller()
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @MessagePattern(FINANCIAL_PATTERNS.CREATE_TRANSACTION)
  async createTransaction(
    @Payload() payload: CreateTransactionRequest,
  ): Promise<TransactionResponse> {
    return this.financialService.createTransaction(payload);
  }

  @MessagePattern(FINANCIAL_PATTERNS.GET_TRANSACTIONS)
  async getTransactions(
    @Payload() payload: GetTransactionsRequest,
  ): Promise<PaginatedTransactionsResponse> {
    return this.financialService.getTransactions(payload);
  }

  @MessagePattern(FINANCIAL_PATTERNS.DELETE_TRANSACTIONS)
  async deleteTransactions(
    @Payload() payload: DeleteTransactionsRequest,
  ): Promise<DeleteTransactionsResponse> {
    return this.financialService.deleteTransactions(payload);
  }

  @MessagePattern(FINANCIAL_PATTERNS.GET_REPORT)
  async getReport(
    @Payload() payload: GetFinancialReportRequest,
  ): Promise<FinancialReportResponse> {
    return this.financialService.getReport(payload);
  }
}
