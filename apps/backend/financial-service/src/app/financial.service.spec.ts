import { RpcException } from '@nestjs/microservices';
import {
  CreateTransactionRequest,
  GetFinancialReportRequest,
  GetTransactionsRequest,
} from '@financial-tracker/contracts';
import { FinancialService } from './financial.service';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionDocument } from './schemas/transaction.schema';

const buildTransaction = (
  transaction: Partial<TransactionDocument>,
): TransactionDocument => {
  return transaction as TransactionDocument;
};

describe('FinancialService', () => {
  let service: FinancialService;

  const transactionRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    countAll: jest.fn(),
    deleteManyByIds: jest.fn(),
    findByDateRange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new FinancialService(
      transactionRepository as unknown as TransactionRepository,
    );
  });

  it('creates transaction when category matches transaction type', async () => {
    const payload: CreateTransactionRequest = {
      userId: '6a426f90fcc2f5e584cb060a',
      type: 'income',
      amount: 1500,
      category: 'sales',
      description: 'Website payment',
      date: '2026-07-20',
    };

    transactionRepository.create.mockResolvedValue(
      buildTransaction({
        id: '6a426f90fcc2f5e584cb060b',
        ...payload,
      }),
    );

    const result = await service.createTransaction(payload);

    expect(transactionRepository.create).toHaveBeenCalledWith(payload);
    expect(result).toEqual({
      id: '6a426f90fcc2f5e584cb060b',
      userId: '6a426f90fcc2f5e584cb060a',
      type: 'income',
      amount: 1500,
      category: 'sales',
      description: 'Website payment',
      date: '2026-07-20',
    });
  });

  it('throws RpcException for invalid income category', async () => {
    const payload = {
      userId: '6a426f90fcc2f5e584cb060a',
      type: 'income',
      amount: 1500,
      category: 'rent',
      date: '2026-07-20',
    };

    await expect(
      service.createTransaction(payload as CreateTransactionRequest),
    ).rejects.toBeInstanceOf(RpcException);

    expect(transactionRepository.create).not.toHaveBeenCalled();
  });

  it('returns paginated transactions', async () => {
    const payload: GetTransactionsRequest = {
      page: 1,
      limit: 20,
    };

    transactionRepository.findAll.mockResolvedValue([
      buildTransaction({
        id: '6a426f90fcc2f5e584cb060b',
        userId: '6a426f90fcc2f5e584cb060a',
        type: 'income',
        amount: 1500,
        category: 'sales',
        date: '2026-07-20',
      }),
    ]);
    transactionRepository.countAll.mockResolvedValue(1);

    const result = await service.getTransactions(payload);

    expect(transactionRepository.findAll).toHaveBeenCalledWith(1, 20);
    expect(transactionRepository.countAll).toHaveBeenCalled();
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
    expect(result.totalItems).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.items).toHaveLength(1);
  });

  it('limits pagination size to maximum 100', async () => {
    transactionRepository.findAll.mockResolvedValue([]);
    transactionRepository.countAll.mockResolvedValue(0);

    await service.getTransactions({
      page: 0,
      limit: 500,
    });

    expect(transactionRepository.findAll).toHaveBeenCalledWith(1, 100);
  });

  it('deletes transactions by ids', async () => {
    transactionRepository.deleteManyByIds.mockResolvedValue(2);

    const result = await service.deleteTransactions({
      transactionIds: ['6a426f90fcc2f5e584cb060a', '6a426f90fcc2f5e584cb060b'],
    });

    expect(transactionRepository.deleteManyByIds).toHaveBeenCalledWith([
      '6a426f90fcc2f5e584cb060a',
      '6a426f90fcc2f5e584cb060b',
    ]);
    expect(result).toEqual({ deletedCount: 2 });
  });

  it('builds financial report from transactions found by date range', async () => {
    const payload: GetFinancialReportRequest = {
      userId: '6a426f90fcc2f5e584cb060a',
      period: {
        type: 'annual',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
      },
    };

    transactionRepository.findByDateRange.mockResolvedValue([
      buildTransaction({
        type: 'income',
        amount: 12000,
        category: 'sales',
      }),
      buildTransaction({
        type: 'expense',
        amount: 2400,
        category: 'services',
      }),
    ]);

    const result = await service.getReport(payload);

    expect(transactionRepository.findByDateRange).toHaveBeenCalledWith(
      '2026-01-01',
      '2026-12-31',
    );
    expect(result.finalResult.profitBeforeTax).toBe(8000);
    expect(result.finalResult.incomeTax).toBe(960);
  });
});
