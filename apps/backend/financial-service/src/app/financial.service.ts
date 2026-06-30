import { Injectable } from '@nestjs/common';
import {
  CreateTransactionRequest,
  DeleteTransactionsRequest,
  DeleteTransactionsResponse,
  GetTransactionsRequest,
  PaginatedTransactionsResponse,
  TransactionResponse,
  FinancialReportResponse,
  GetFinancialReportRequest,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '@financial-tracker/contracts';
import { buildFinancialReport } from './calculators/financial-report.calculator';
import { TransactionRepository } from './repositories/transaction.repository';
import {
  toTransactionResponse,
  toTransactionResponseList,
} from './mappers/transaction.mapper';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class FinancialService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  private validateTransactionCategory(payload: CreateTransactionRequest): void {
    if (
      payload.type === 'income' &&
      !INCOME_CATEGORIES.includes(payload.category)
    ) {
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid income category.',
      });
    }

    if (
      payload.type === 'expense' &&
      !EXPENSE_CATEGORIES.includes(payload.category)
    ) {
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid expense category.',
      });
    }
  }

  async createTransaction(
    payload: CreateTransactionRequest,
  ): Promise<TransactionResponse> {
    this.validateTransactionCategory(payload);
    const transaction = await this.transactionRepository.create(payload);

    return toTransactionResponse(transaction);
  }

  async getTransactions(
    payload: GetTransactionsRequest,
  ): Promise<PaginatedTransactionsResponse> {
    const page = Math.max(payload.page, 1);
    const limit = Math.min(Math.max(payload.limit, 1), 100);
    const [transactions, totalItems] = await Promise.all([
      this.transactionRepository.findAll(page, limit),
      this.transactionRepository.countAll(),
    ]);

    return {
      items: toTransactionResponseList(transactions),
      page,
      limit,
      totalItems,
      totalPages: Math.max(Math.ceil(totalItems / limit), 1),
    };
  }

  async deleteTransactions(
    payload: DeleteTransactionsRequest,
  ): Promise<DeleteTransactionsResponse> {
    const deletedCount = await this.transactionRepository.deleteManyByIds(
      payload.transactionIds,
    );

    return { deletedCount };
  }

  async getReport(
    payload: GetFinancialReportRequest,
  ): Promise<FinancialReportResponse> {
    const transactions = await this.transactionRepository.findByDateRange(
      payload.period.startDate,
      payload.period.endDate,
    );

    return buildFinancialReport(payload, transactions);
  }
}
