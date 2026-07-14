import { getFinancialReportQuerySchema } from '@financial-tracker/contracts';
import { createZodDto } from 'nestjs-zod';

export class GetFinancialReportQueryDto extends createZodDto(
  getFinancialReportQuerySchema,
) {}
