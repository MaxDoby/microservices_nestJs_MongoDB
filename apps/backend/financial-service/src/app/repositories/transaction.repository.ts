import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransactionRequest } from '@financial-tracker/contracts';
import {
  Transaction,
  TransactionDocument,
} from '../schemas/transaction.schema';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {}

  create(payload: CreateTransactionRequest): Promise<TransactionDocument> {
    return this.transactionModel.create(payload);
  }

  findAll(page: number, limit: number): Promise<TransactionDocument[]> {
    return this.transactionModel
      .find()
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  countAll(): Promise<number> {
    return this.transactionModel.countDocuments().exec();
  }

  async deleteManyByIds(transactionIds: string[]): Promise<number> {
    const result = await this.transactionModel
      .deleteMany({
        _id: {
          $in: transactionIds,
        },
      })
      .exec();

    return result.deletedCount;
  }

  findByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<TransactionDocument[]> {
    return this.transactionModel
      .find({
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .exec();
  }
}
