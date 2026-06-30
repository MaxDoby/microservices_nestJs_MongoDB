import { TransactionResponse } from '@financial-tracker/contracts';
import { TransactionDocument } from '../schemas/transaction.schema';

export const toTransactionResponse = (
  transaction: TransactionDocument,
): TransactionResponse => ({
  id: transaction.id,
  userId: transaction.userId,
  type: transaction.type,
  amount: transaction.amount,
  category: transaction.category,
  description: transaction.description,
  date: transaction.date,
});

export const toTransactionResponseList = (
  transactions: TransactionDocument[],
): TransactionResponse[] => {
  return transactions.map(toTransactionResponse);
};
