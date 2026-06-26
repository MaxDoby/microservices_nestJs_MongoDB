import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateTransactionRequest,
  GetTransactionsRequest,
  TransactionResponse,
} from '@financial-tracker/contracts';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';

@Injectable()
export class FinancialService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {}

  async createTransaction(
    payload: CreateTransactionRequest,
  ): Promise<TransactionResponse> {
    const transaction = await this.transactionModel.create(payload);

    return {
      id: transaction.id,
      userId: transaction.userId,
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      date: transaction.date,
    };
  }

  async getTransactions(
    payload: GetTransactionsRequest,
  ): Promise<TransactionResponse[]> {
    const transactions = await this.transactionModel.find({
      userId: payload.userId,
    });

    return transactions.map((transaction) => ({
      id: transaction.id,
      userId: transaction.userId,
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      date: transaction.date,
    }));
  }
}
