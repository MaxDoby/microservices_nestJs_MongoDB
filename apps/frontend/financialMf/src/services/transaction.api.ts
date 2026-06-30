import type {
  Transaction,
  CreateTransactionPayload,
  DeleteTransactionsPayload,
  PaginatedTransactions,
} from '../types/transaction.types';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchTransactions = async (
  authToken: string,
  page: number,
  limit: number,
): Promise<PaginatedTransactions> => {
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const response = await fetch(`${API_URL}/transactions?${searchParams}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Could not load transactions.');
  }

  return data;
};

export const createTransactionRequest = async (
  authToken: string,
  payload: CreateTransactionPayload,
): Promise<Transaction> => {
  const response = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
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
  authToken: string,
  payload: DeleteTransactionsPayload,
): Promise<{ deletedCount: number }> => {
  const response = await fetch(`${API_URL}/transactions`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Could not delete transactions.');
  }

  return data;
};
