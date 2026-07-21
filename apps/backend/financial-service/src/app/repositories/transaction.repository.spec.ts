import type { Model } from 'mongoose';
import { TransactionRepository } from './transaction.repository';
import type { TransactionDocument } from '../schemas/transaction.schema';

const buildQuery = <T>(result: T) => ({
  exec: jest.fn().mockResolvedValue(result),
});

describe('TransactionRepository', () => {
  const transactionModel = {
    create: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    deleteMany: jest.fn(),
  };

  let repository: TransactionRepository;

  beforeEach(() => {
    jest.clearAllMocks();

    repository = new TransactionRepository(
      transactionModel as unknown as Model<TransactionDocument>,
    );
  });

  it('should create transaction', async () => {
    const payload = {
      userId: '6a426f90fcc2f5e584cb060a',
      type: 'income' as const,
      amount: 1500,
      category: 'sales' as const,
      date: '2026-07-20',
    };
    const transaction = {
      id: '6a426f90fcc2f5e584cb060b',
      ...payload,
    } as TransactionDocument;

    transactionModel.create.mockResolvedValue(transaction);

    await expect(repository.create(payload)).resolves.toBe(transaction);

    expect(transactionModel.create).toHaveBeenCalledWith(payload);
  });

  it('should find paginated transactions sorted by newest first', async () => {
    const transactions = [{ id: '6a426f90fcc2f5e584cb060b' }] as TransactionDocument[];
    const exec = jest.fn().mockResolvedValue(transactions);
    const limit = jest.fn().mockReturnValue({ exec });
    const skip = jest.fn().mockReturnValue({ limit });
    const sort = jest.fn().mockReturnValue({ skip });

    transactionModel.find.mockReturnValue({ sort });

    await expect(repository.findAll(2, 20)).resolves.toBe(transactions);

    expect(transactionModel.find).toHaveBeenCalledWith();
    expect(sort).toHaveBeenCalledWith({ createdAt: -1, _id: -1 });
    expect(skip).toHaveBeenCalledWith(20);
    expect(limit).toHaveBeenCalledWith(20);
    expect(exec).toHaveBeenCalled();
  });

  it('should count all transactions', async () => {
    const query = buildQuery(12);

    transactionModel.countDocuments.mockReturnValue(query);

    await expect(repository.countAll()).resolves.toBe(12);

    expect(transactionModel.countDocuments).toHaveBeenCalledWith();
    expect(query.exec).toHaveBeenCalled();
  });

  it('should delete transactions by ids and return deleted count', async () => {
    const query = buildQuery({ deletedCount: 2 });

    transactionModel.deleteMany.mockReturnValue(query);

    await expect(
      repository.deleteManyByIds([
        '6a426f90fcc2f5e584cb060a',
        '6a426f90fcc2f5e584cb060b',
      ]),
    ).resolves.toBe(2);

    expect(transactionModel.deleteMany).toHaveBeenCalledWith({
      _id: {
        $in: ['6a426f90fcc2f5e584cb060a', '6a426f90fcc2f5e584cb060b'],
      },
    });
  });

  it('should find transactions by date range', async () => {
    const transactions = [{ id: '6a426f90fcc2f5e584cb060b' }] as TransactionDocument[];
    const query = buildQuery(transactions);

    transactionModel.find.mockReturnValue(query);

    await expect(
      repository.findByDateRange('2026-01-01', '2026-12-31'),
    ).resolves.toBe(transactions);

    expect(transactionModel.find).toHaveBeenCalledWith({
      date: {
        $gte: '2026-01-01',
        $lte: '2026-12-31',
      },
    });
  });
});
