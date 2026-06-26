import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateTransactionRequest,
  FINANCIAL_PATTERNS,
  GetTransactionsRequest,
  TransactionResponse,
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
  ): Promise<TransactionResponse[]> {
    return this.financialService.getTransactions(payload);
  }
}
