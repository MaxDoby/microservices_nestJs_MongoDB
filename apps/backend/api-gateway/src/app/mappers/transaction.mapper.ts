import { BadRequestException } from '@nestjs/common';
import {
  CreateTransactionRequest,
  createTransactionBodySchema,
} from '@financial-tracker/contracts';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

export const buildCreateTransactionRequest = (
  userId: string,
  body: CreateTransactionDto,
): CreateTransactionRequest => {
  const validationResult = createTransactionBodySchema.safeParse(body);

  if (!validationResult.success) {
    throw new BadRequestException('Invalid transaction body.');
  }

  const validBody = validationResult.data;

  if (validBody.type === 'income') {
    return {
      userId,
      type: 'income',
      amount: validBody.amount,
      category: validBody.category,
      description: validBody.description,
      date: validBody.date,
    };
  }

  return {
    userId,
    type: 'expense',
    amount: validBody.amount,
    category: validBody.category,
    description: validBody.description,
    date: validBody.date,
  };
};
