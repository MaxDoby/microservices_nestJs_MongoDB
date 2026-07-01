import type {
  Transaction,
  CreateTransactionPayload,
  DeleteTransactionsPayload,
  PaginatedTransactions,
} from '../types/transaction.types';
import { authenticatedFetch } from '@financial-tracker/frontend-auth';

export const fetchTransactions = async (
  page: number,
  limit: number,
): Promise<PaginatedTransactions> => {
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const response = await authenticatedFetch(`/transactions?${searchParams}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Could not load transactions.');
  }

  return data;
};

export const createTransactionRequest = async (
  payload: CreateTransactionPayload,
): Promise<Transaction> => {
  const response = await authenticatedFetch('/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Could not create transaction.');
  }

  return data;
};

export const deleteTransactionsRequest = async (
  payload: DeleteTransactionsPayload,
): Promise<{ deletedCount: number }> => {
  const response = await authenticatedFetch('/transactions', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Could not delete transactions.');
  }

  return data;
};
