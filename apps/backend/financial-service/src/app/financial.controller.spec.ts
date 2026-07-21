import { FinancialController } from './financial.controller';
import type { FinancialService } from './financial.service';

describe('FinancialController', () => {
  const financialService = {
    createTransaction: jest.fn(),
    getTransactions: jest.fn(),
    deleteTransactions: jest.fn(),
    getReport: jest.fn(),
  };

  let controller: FinancialController;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new FinancialController(
      financialService as unknown as FinancialService,
    );
  });

  it('delegates create transaction payload to financial service', async () => {
    const payload = {
      userId: '6a426f90fcc2f5e584cb060a',
      type: 'income' as const,
      amount: 1500,
      category: 'sales',
      date: '2026-07-20',
    } as const;

    financialService.createTransaction.mockResolvedValue({ id: 'transaction-id' });

    await expect(controller.createTransaction(payload)).resolves.toEqual({
      id: 'transaction-id',
    });
    expect(financialService.createTransaction).toHaveBeenCalledWith(payload);
  });

  it('delegates get transactions payload to financial service', async () => {
    const payload = {
      page: 1,
      limit: 20,
    };

    financialService.getTransactions.mockResolvedValue({ items: [] });

    await expect(controller.getTransactions(payload)).resolves.toEqual({
      items: [],
    });
    expect(financialService.getTransactions).toHaveBeenCalledWith(payload);
  });

  it('delegates delete transactions payload to financial service', async () => {
    const payload = {
      transactionIds: ['6a426f90fcc2f5e584cb060b'],
    };

    financialService.deleteTransactions.mockResolvedValue({ deletedCount: 1 });

    await expect(controller.deleteTransactions(payload)).resolves.toEqual({
      deletedCount: 1,
    });
    expect(financialService.deleteTransactions).toHaveBeenCalledWith(payload);
  });

  it('delegates report payload to financial service', async () => {
    const payload = {
      userId: '6a426f90fcc2f5e584cb060a',
      period: {
        type: 'annual' as const,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
      },
    };

    financialService.getReport.mockResolvedValue({ userId: payload.userId });

    await expect(controller.getReport(payload)).resolves.toEqual({
      userId: payload.userId,
    });
    expect(financialService.getReport).toHaveBeenCalledWith(payload);
  });
});
