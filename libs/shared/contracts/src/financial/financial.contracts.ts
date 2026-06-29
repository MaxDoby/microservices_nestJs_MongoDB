export type TransactionType = 'income' | 'expense';

export interface CreateTransactionRequest {
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  description?: string;
  date: string;
}

export interface TransactionResponse {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  description?: string;
  date: string;
}

export interface GetTransactionsRequest {
  userId: string;
}

export interface GetFinancialSummaryRequest {
  userId: string;
}

export interface FinancialSummaryResponse {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  estimatedTax: number;
}
