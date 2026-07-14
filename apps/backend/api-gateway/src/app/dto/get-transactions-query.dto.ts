import { getTransactionsQuerySchema } from '@financial-tracker/contracts';
import { createZodDto } from 'nestjs-zod';

export class GetTransactionsQueryDto extends createZodDto(
  getTransactionsQuerySchema,
) {}
