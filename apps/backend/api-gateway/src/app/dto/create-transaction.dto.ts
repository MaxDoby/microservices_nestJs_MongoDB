import { createTransactionHttpBodySchema } from '@financial-tracker/contracts';
import { createZodDto } from 'nestjs-zod';

export class CreateTransactionDto extends createZodDto(
  createTransactionHttpBodySchema,
) {}
