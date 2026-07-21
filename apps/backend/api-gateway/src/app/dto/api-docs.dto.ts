import { createZodDto } from 'nestjs-zod';
import {
  authResponseSchema,
  logoutResponseSchema,
  validateTokenResponseSchema,
  transactionResponseSchema,
  paginatedTransactionsResponseSchema,
  deleteTransactionsResponseSchema,
  financialReportResponseSchema,
  errorResponseSchema,
} from '@financial-tracker/contracts';

export class ErrorResponseDto extends createZodDto(errorResponseSchema) {}

export class LogoutResponseDto extends createZodDto(logoutResponseSchema) {}

export class AuthResponseDto extends createZodDto(authResponseSchema) {}

export class ValidateTokenResponseDto extends createZodDto(
  validateTokenResponseSchema,
) {}

export class TransactionResponseDto extends createZodDto(
  transactionResponseSchema,
) {}

export class PaginatedTransactionsResponseDto extends createZodDto(
  paginatedTransactionsResponseSchema,
) {}

export class DeleteTransactionsResponseDto extends createZodDto(
  deleteTransactionsResponseSchema,
) {}

export class FinancialReportResponseDto extends createZodDto(
  financialReportResponseSchema,
) {}
