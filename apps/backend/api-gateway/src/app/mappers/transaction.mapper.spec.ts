import { BadRequestException } from '@nestjs/common';
import { buildCreateTransactionRequest } from './transaction.mapper';

describe('buildCreateTransactionRequest', () => {
  it('should build income transaction request', () => {
    expect(
      buildCreateTransactionRequest('6a426f90fcc2f5e584cb060a', {
        type: 'income',
        amount: 1500,
        category: 'sales',
        description: 'Website payment',
        date: '2026-07-20',
      }),
    ).toEqual({
      userId: '6a426f90fcc2f5e584cb060a',
      type: 'income',
      amount: 1500,
      category: 'sales',
      description: 'Website payment',
      date: '2026-07-20',
    });
  });

  it('should build expense transaction request', () => {
    expect(
      buildCreateTransactionRequest('6a426f90fcc2f5e584cb060a', {
        type: 'expense',
        amount: 500,
        category: 'rent',
        date: '2026-07-20',
      }),
    ).toEqual({
      userId: '6a426f90fcc2f5e584cb060a',
      type: 'expense',
      amount: 500,
      category: 'rent',
      date: '2026-07-20',
    });
  });

  it('should throw BadRequestException for invalid transaction body', () => {
    expect(() =>
      buildCreateTransactionRequest('6a426f90fcc2f5e584cb060a', {
        type: 'income',
        amount: 500,
        category: 'rent',
        date: '2026-07-20',
      }),
    ).toThrow(BadRequestException);
  });
});
