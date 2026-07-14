import { z } from 'zod';

export const EXPENSE_CATEGORIES = [
  'salary',
  'rent',
  'utilities',
  'leasing',
  'office',
  'services',
  'maintenance',
  'materials',
  'equipment',
  'transport',
  'marketing',
  'software',
  'other',
] as const;

export const expenseCategorySchema = z.enum(EXPENSE_CATEGORIES);

export type ExpenseCategory = z.infer<typeof expenseCategorySchema>;

export const INCOME_CATEGORIES = [
  'sales',
  'services',
  'consulting',
  'other',
] as const;

export const incomeCategorySchema = z.enum(INCOME_CATEGORIES);

export type IncomeCategory = z.infer<typeof incomeCategorySchema>;

export const transactionTypeSchema = z.enum(['income', 'expense']);

export type TransactionType = z.infer<typeof transactionTypeSchema>;

export const mongoIdSchema = z.string().regex(/^[a-f\d]{24}$/i, {
  message: 'Invalid MongoDB object id.',
});

export const createIncomeTransactionBodySchema = z.object({
  type: z.literal('income'),
  amount: z.number().positive(),
  category: incomeCategorySchema,
  description: z.string().optional(),
  date: z.iso.date(),
}).strict();

export const createExpenseTransactionBodySchema = z.object({
  type: z.literal('expense'),
  amount: z.number().positive(),
  category: expenseCategorySchema,
  description: z.string().optional(),
  date: z.iso.date(),
}).strict();

export const createTransactionBodySchema = z.discriminatedUnion('type', [
  createIncomeTransactionBodySchema,
  createExpenseTransactionBodySchema,
]);

export type CreateTransactionBody = z.infer<typeof createTransactionBodySchema>;

export const createIncomeTransactionRequestSchema =
  createIncomeTransactionBodySchema.extend({
    userId: z.string().min(1),
  });

export const createExpenseTransactionRequestSchema =
  createExpenseTransactionBodySchema.extend({
    userId: z.string().min(1),
  });

export const createTransactionRequestSchema = z.discriminatedUnion('type', [
  createIncomeTransactionRequestSchema,
  createExpenseTransactionRequestSchema,
]);

export type CreateTransactionRequest = z.infer<
  typeof createTransactionRequestSchema
>;

export const TRANSACTION_CATEGORIES = [
  ...EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES,
] as const;

export const transactionCategorySchema = z.enum(TRANSACTION_CATEGORIES);

export type TransactionCategory = z.infer<typeof transactionCategorySchema>;

export const createTransactionHttpBodySchema = z.object({
  type: transactionTypeSchema,
  amount: z.number().positive(),
  category: transactionCategorySchema,
  description: z.string().optional(),
  date: z.iso.date(),
}).strict();

export type CreateTransactionHttpBody = z.infer<
  typeof createTransactionHttpBodySchema
>;

export const transactionResponseSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  type: transactionTypeSchema,
  amount: z.number().positive(),
  category: transactionCategorySchema,
  description: z.string().optional(),
  date: z.string(),
});

export type TransactionResponse = z.infer<typeof transactionResponseSchema>;

export const getTransactionsRequestSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
}).strict();

export type GetTransactionsRequest = z.infer<
  typeof getTransactionsRequestSchema
>;

export const getTransactionsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
}).strict();

export type GetTransactionsQuery = z.infer<typeof getTransactionsQuerySchema>;

export const paginatedTransactionsResponseSchema = z.object({
  items: z.array(transactionResponseSchema),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export type PaginatedTransactionsResponse = z.infer<
  typeof paginatedTransactionsResponseSchema
>;

export const deleteTransactionsRequestSchema = z.object({
  transactionIds: z.array(mongoIdSchema).min(1),
}).strict();

export type DeleteTransactionsRequest = z.infer<
  typeof deleteTransactionsRequestSchema
>;

export const deleteTransactionsResponseSchema = z.object({
  deletedCount: z.number().int().nonnegative(),
});

export type DeleteTransactionsResponse = z.infer<
  typeof deleteTransactionsResponseSchema
>;

export const financialReportPeriodSchema = z.enum([
  'monthly',
  'quarterly',
  'annual',
]);

export type FinancialReportPeriod = z.infer<typeof financialReportPeriodSchema>;

export const taxConfigSchema = z.object({
  vatRate: z.number().nonnegative(),
  corporateIncomeTaxRate: z.number().nonnegative(),
  pensionFundRate: z.number().nonnegative(),
  medicalFundRate: z.number().nonnegative(),
  socialInsuranceRate: z.number().nonnegative(),
});

export type TaxConfig = z.infer<typeof taxConfigSchema>;

export const revenueSectionSchema = z.object({
  grossRevenue: z.number(),
  netRevenue: z.number(),
  vatCollected: z.number(),
});

export type RevenueSection = z.infer<typeof revenueSectionSchema>;

export const socialContributionSectionSchema = z.object({
  pensionFund: z.number(),
  medicalFund: z.number(),
  socialInsuranceFund: z.number(),
  otherContributions: z.number(),
  totalSocialContributions: z.number(),
});

export type SocialContributionSection = z.infer<
  typeof socialContributionSectionSchema
>;

export const administrativeExpenseSectionSchema = z.object({
  rent: z.number(),
  utilities: z.number(),
  leasing: z.number(),
  office: z.number(),
  services: z.number(),
  maintenance: z.number(),
  totalAdministrativeExpenses: z.number(),
});

export type AdministrativeExpenseSection = z.infer<
  typeof administrativeExpenseSectionSchema
>;

export const taxExpenseSectionSchema = z.object({
  vatToPay: z.number(),
  corporateIncomeTax: z.number(),
  otherTaxes: z.number(),
  totalTaxExpense: z.number(),
});

export type TaxExpenseSection = z.infer<typeof taxExpenseSectionSchema>;

export const operationalExpenseSectionSchema = z.object({
  materials: z.number(),
  equipment: z.number(),
  transport: z.number(),
  marketing: z.number(),
  software: z.number(),
  totalOperationalExpenses: z.number(),
});

export type OperationalExpenseSection = z.infer<
  typeof operationalExpenseSectionSchema
>;

export const otherExpenseSectionSchema = z.object({
  uncategorized: z.number(),
  totalOtherExpenses: z.number(),
});

export type OtherExpenseSection = z.infer<typeof otherExpenseSectionSchema>;

export const payrollSectionSchema = z.object({
  grossSalaries: z.number(),
  netSalaries: z.number(),
  pensionFund: z.number(),
  medicalFund: z.number(),
  socialInsuranceFund: z.number(),
  totalPayrollTaxes: z.number(),
  totalPayrollCost: z.number(),
});

export type PayrollSection = z.infer<typeof payrollSectionSchema>;

export const expenseSectionSchema = z.object({
  grossExpenses: z.number(),
  netExpenses: z.number(),
  vatDeductible: z.number(),
  payrollExpenses: payrollSectionSchema,
  socialContributionExpenses: socialContributionSectionSchema,
  administrativeExpenses: administrativeExpenseSectionSchema,
  taxExpenses: taxExpenseSectionSchema,
  operationalExpenses: operationalExpenseSectionSchema,
  otherExpenses: otherExpenseSectionSchema,
});

export type ExpenseSection = z.infer<typeof expenseSectionSchema>;

export const vatSectionSchema = z.object({
  vatCollectedFromRevenue: z.number(),
  vatDeductibleFromExpenses: z.number(),
  vatToPay: z.number(),
});

export type VatSection = z.infer<typeof vatSectionSchema>;

export const corporateResultSectionSchema = z.object({
  netRevenue: z.number(),
  netExpenses: z.number(),
  payrollCost: z.number(),
  operatingProfit: z.number(),
});

export type CorporateResultSection = z.infer<
  typeof corporateResultSectionSchema
>;

export const finalResultSectionSchema = z.object({
  profitBeforeTax: z.number(),
  incomeTax: z.number(),
  profitAfterTax: z.number(),
});

export type FinalResultSection = z.infer<typeof finalResultSectionSchema>;

export const financialReportPeriodRangeSchema = z.object({
  type: financialReportPeriodSchema,
  startDate: z.iso.date(),
  endDate: z.iso.date(),
}).strict();

export type FinancialReportPeriodRange = z.infer<
  typeof financialReportPeriodRangeSchema
>;

export const getFinancialReportRequestSchema = z.object({
  userId: z.string().min(1),
  period: financialReportPeriodRangeSchema,
}).strict();

export type GetFinancialReportRequest = z.infer<
  typeof getFinancialReportRequestSchema
>;

export const getFinancialReportQuerySchema = z.object({
  period: financialReportPeriodSchema,
  startDate: z.iso.date(),
  endDate: z.iso.date(),
}).strict();

export type GetFinancialReportQuery = z.infer<
  typeof getFinancialReportQuerySchema
>;

export const financialReportResponseSchema = z.object({
  userId: z.string(),
  period: financialReportPeriodRangeSchema,
  generatedAt: z.string(),
  revenue: revenueSectionSchema,
  expenses: expenseSectionSchema,
  vat: vatSectionSchema,
  corporateResult: corporateResultSectionSchema,
  finalResult: finalResultSectionSchema,
});

export type FinancialReportResponse = z.infer<
  typeof financialReportResponseSchema
>;
