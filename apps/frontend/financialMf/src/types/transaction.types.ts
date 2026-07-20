import type {
  CreateTransactionDto,
  DeleteTransactionsDto,
  PaginatedTransactionsResponseDto,
  TransactionResponseDto,
} from '@financial-tracker/generated-api';


export type Transaction = TransactionResponseDto;
export type PaginatedTransactions = PaginatedTransactionsResponseDto;
export type CreateTransactionPayload = CreateTransactionDto;
export type DeleteTransactionsPayload = DeleteTransactionsDto;