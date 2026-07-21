import { TransactionDocument } from '../schemas/transaction.schema';
import {
  toTransactionResponse,
  toTransactionResponseList,
} from './transaction.mapper';

const buildTransaction = (
  transaction: Partial<TransactionDocument>,
): TransactionDocument => {
  return transaction as TransactionDocument;
};

describe('transaction.mapper', () => {
  it('maps transaction document to transaction response', () => {
    const transaction = buildTransaction({
      id: '6a426f90fcc2f5e584cb060a',
      userId: '6a426f90fcc2f5e584cb060b',
      type: 'income',
      amount: 1500,
      category: 'sales',
      description: 'Website project payment',
      date: '2026-07-20',
    });

    const response = toTransactionResponse(transaction);

    expect(response).toEqual({
      id: '6a426f90fcc2f5e584cb060a',
      userId: '6a426f90fcc2f5e584cb060b',
      type: 'income',
      amount: 1500,
      category: 'sales',
      description: 'Website project payment',
      date: '2026-07-20',
    });
  });

  it('maps transaction document list to transaction response list', () => {
    const transactions = [
      buildTransaction({
        id: '6a426f90fcc2f5e584cb060a',
        userId: '6a426f90fcc2f5e584cb060b',
        type: 'income',
        amount: 1500,
        category: 'sales',
        date: '2026-07-20',
      }),
      buildTransaction({
        id: '6a426f90fcc2f5e584cb060c',
        userId: '6a426f90fcc2f5e584cb060b',
        type: 'expense',
        amount: 500,
        category: 'rent',
        date: '2026-07-21',
      }),
    ];

    const response = toTransactionResponseList(transactions);

    expect(response).toHaveLength(2);
    expect(response[0].type).toBe('income');
    expect(response[1].type).toBe('expense');
  });

  it('throws validation error for invalid mapped response', () => {
    const transaction = buildTransaction({
      id: '6a426f90fcc2f5e584cb060a',
      userId: '6a426f90fcc2f5e584cb060b',
      type: 'income',
      amount: -100,
      category: 'sales',
      date: '2026-07-20',
    });

    expect(() => toTransactionResponse(transaction)).toThrow();
  });
});
