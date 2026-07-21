import type {
  Transaction,
  CreateTransactionPayload,
  DeleteTransactionsPayload,
  PaginatedTransactions,
} from '../types/transaction.types';
import { authenticatedFetch } from '@financial-tracker/frontend-auth';
import {
  zFinancialControllerCreateTransactionBody,
  zFinancialControllerCreateTransactionResponse,
  zFinancialControllerDeleteTransactionsBody,
  zFinancialControllerDeleteTransactionsResponse,
  zFinancialControllerGetTransactionsQuery,
  zFinancialControllerGetTransactionsResponse,
} from '@financial-tracker/generated-api';

export const fetchTransactions = async (
  page: number,
  limit: number,
): Promise<PaginatedTransactions> => {
  const query = zFinancialControllerGetTransactionsQuery.parse({
    page,
    limit,
  });

  const searchParams = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });

  const response = await authenticatedFetch(`/transactions?${searchParams}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Could not load transactions.');
  }

  return zFinancialControllerGetTransactionsResponse.parse(data);
};

export const createTransactionRequest = async (
  payload: CreateTransactionPayload,
): Promise<Transaction> => {
  const body = zFinancialControllerCreateTransactionBody.parse(payload);

  const response = await authenticatedFetch('/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Could not create transaction.');
  }

  return zFinancialControllerCreateTransactionResponse.parse(data);
};

export const deleteTransactionsRequest = async (
  payload: DeleteTransactionsPayload,
): Promise<{ deletedCount: number }> => {
  const body = zFinancialControllerDeleteTransactionsBody.parse(payload);

  const response = await authenticatedFetch('/transactions', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Could not delete transactions.');
  }

  return zFinancialControllerDeleteTransactionsResponse.parse(data);
};
