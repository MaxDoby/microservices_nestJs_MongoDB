import { BadRequestException } from '@nestjs/common';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  ExpenseCategory,
  IncomeCategory,
  TransactionCategory,
  CreateTransactionRequest,
} from '@financial-tracker/contracts';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

const isIncomeCategory = (
  category: TransactionCategory,
): category is IncomeCategory => {
  return (INCOME_CATEGORIES as readonly string[]).includes(category);
};

const isExpenseCategory = (
  category: TransactionCategory,
): category is ExpenseCategory => {
  return (EXPENSE_CATEGORIES as readonly string[]).includes(category);
};

export const buildCreateTransactionRequest = (
  userId: string,
  body: CreateTransactionDto,
): CreateTransactionRequest => {
  if (body.type === 'income') {
    if (!isIncomeCategory(body.category)) {
      throw new BadRequestException('Invalid income category.');
    }

    return {
      userId,
      type: 'income',
      amount: body.amount,
      category: body.category,
      description: body.description,
      date: body.date,
    };
  }

  if (!isExpenseCategory(body.category)) {
    throw new BadRequestException('Invalid expense category.');
  }

  return {
    userId,
    type: 'expense',
    amount: body.amount,
    category: body.category,
    description: body.description,
    date: body.date,
  };
};
