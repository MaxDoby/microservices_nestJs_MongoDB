import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  type CreateTransactionHttpBody,
  type DeleteTransactionsRequest,
  type ExpenseCategory,
  type IncomeCategory,
  type PaginatedTransactionsResponse,
  type TransactionCategory,
  type TransactionResponse,
  type TransactionType,
} from '@financial-tracker/contracts';

export type Transaction = TransactionResponse;
export type PaginatedTransactions = PaginatedTransactionsResponse;
export type CreateTransactionPayload = CreateTransactionHttpBody;
export type DeleteTransactionsPayload = DeleteTransactionsRequest;

export type {
  ExpenseCategory,
  IncomeCategory,
  TransactionCategory,
  TransactionType,
};

export const incomeCategories: IncomeCategory[] = [...INCOME_CATEGORIES];
export const expenseCategories: ExpenseCategory[] = [...EXPENSE_CATEGORIES];
