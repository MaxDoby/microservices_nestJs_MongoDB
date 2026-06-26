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
