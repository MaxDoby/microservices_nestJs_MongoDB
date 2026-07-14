import { deleteTransactionsRequestSchema } from '@financial-tracker/contracts';
import { createZodDto } from 'nestjs-zod';

export class DeleteTransactionsDto extends createZodDto(
  deleteTransactionsRequestSchema,
) {}
