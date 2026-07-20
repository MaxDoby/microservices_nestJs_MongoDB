import { z } from 'zod';
import * as financialSchemas from './financial.schemas';

export type ExpenseCategory = z.infer<
  typeof financialSchemas.expenseCategorySchema
>;

export type IncomeCategory = z.infer<
  typeof financialSchemas.incomeCategorySchema
>;

export type TransactionType = z.infer<
  typeof financialSchemas.transactionTypeSchema
>;

export type CreateTransactionBody = z.infer<
  typeof financialSchemas.createTransactionBodySchema
>;

export type CreateTransactionRequest = z.infer<
  typeof financialSchemas.createTransactionRequestSchema
>;

export type TransactionCategory = z.infer<
  typeof financialSchemas.transactionCategorySchema
>;

export type CreateTransactionHttpBody = z.infer<
  typeof financialSchemas.createTransactionHttpBodySchema
>;

export type TransactionResponse = z.infer<
  typeof financialSchemas.transactionResponseSchema
>;

export type GetTransactionsRequest = z.infer<
  typeof financialSchemas.getTransactionsRequestSchema
>;

export type GetTransactionsQuery = z.infer<
  typeof financialSchemas.getTransactionsQuerySchema
>;

export type PaginatedTransactionsResponse = z.infer<
  typeof financialSchemas.paginatedTransactionsResponseSchema
>;

export type DeleteTransactionsRequest = z.infer<
  typeof financialSchemas.deleteTransactionsRequestSchema
>;

export type DeleteTransactionsResponse = z.infer<
  typeof financialSchemas.deleteTransactionsResponseSchema
>;

export type FinancialReportPeriod = z.infer<
  typeof financialSchemas.financialReportPeriodSchema
>;

export type TaxConfig = z.infer<typeof financialSchemas.taxConfigSchema>;

export type RevenueSection = z.infer<
  typeof financialSchemas.revenueSectionSchema
>;

export type SocialContributionSection = z.infer<
  typeof financialSchemas.socialContributionSectionSchema
>;

export type AdministrativeExpenseSection = z.infer<
  typeof financialSchemas.administrativeExpenseSectionSchema
>;

export type TaxExpenseSection = z.infer<
  typeof financialSchemas.taxExpenseSectionSchema
>;

export type OperationalExpenseSection = z.infer<
  typeof financialSchemas.operationalExpenseSectionSchema
>;

export type OtherExpenseSection = z.infer<
  typeof financialSchemas.otherExpenseSectionSchema
>;

export type PayrollSection = z.infer<
  typeof financialSchemas.payrollSectionSchema
>;

export type ExpenseSection = z.infer<
  typeof financialSchemas.expenseSectionSchema
>;

export type VatSection = z.infer<typeof financialSchemas.vatSectionSchema>;

export type CorporateResultSection = z.infer<
  typeof financialSchemas.corporateResultSectionSchema
>;

export type FinalResultSection = z.infer<
  typeof financialSchemas.finalResultSectionSchema
>;

export type FinancialReportPeriodRange = z.infer<
  typeof financialSchemas.financialReportPeriodRangeSchema
>;

export type GetFinancialReportRequest = z.infer<
  typeof financialSchemas.getFinancialReportRequestSchema
>;

export type GetFinancialReportQuery = z.infer<
  typeof financialSchemas.getFinancialReportQuerySchema
>;

export type FinancialReportResponse = z.infer<
  typeof financialSchemas.financialReportResponseSchema
>;
