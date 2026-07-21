import { z } from 'zod';
import {
  EXPENSE_CATEGORIES,
  FINANCIAL_REPORT_PERIODS,
  INCOME_CATEGORIES,
  TRANSACTION_CATEGORIES,
} from './financial.constants';

export const expenseCategorySchema = z.enum(EXPENSE_CATEGORIES);

export const incomeCategorySchema = z.enum(INCOME_CATEGORIES);

export const transactionTypeSchema = z.enum(['income', 'expense']);

export const mongoIdSchema = z.string().regex(/^[a-f\d]{24}$/i, {
  message: 'Invalid MongoDB object id.',
});

export const createIncomeTransactionBodySchema = z
  .object({
    type: z.literal('income'),
    amount: z.number().positive(),
    category: incomeCategorySchema,
    description: z.string().optional(),
    date: z.iso.date(),
  })
  .strict();

export const createExpenseTransactionBodySchema = z
  .object({
    type: z.literal('expense'),
    amount: z.number().positive(),
    category: expenseCategorySchema,
    description: z.string().optional(),
    date: z.iso.date(),
  })
  .strict();

export const createTransactionBodySchema = z.discriminatedUnion('type', [
  createIncomeTransactionBodySchema,
  createExpenseTransactionBodySchema,
]);

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

export const transactionCategorySchema = z.enum(TRANSACTION_CATEGORIES);

export const createTransactionHttpBodySchema = z
  .object({
    type: transactionTypeSchema,
    amount: z.number().positive(),
    category: transactionCategorySchema,
    description: z.string().optional(),
    date: z.iso.date(),
  })
  .strict();

export const transactionResponseSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  type: transactionTypeSchema,
  amount: z.number().positive(),
  category: transactionCategorySchema,
  description: z.string().optional(),
  date: z.string(),
});

export const getTransactionsRequestSchema = z
  .object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
  })
  .strict();

export const getTransactionsQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  })
  .strict();

export const paginatedTransactionsResponseSchema = z.object({
  items: z.array(transactionResponseSchema),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export const deleteTransactionsRequestSchema = z
  .object({
    transactionIds: z.array(mongoIdSchema).min(1),
  })
  .strict();

export const deleteTransactionsResponseSchema = z.object({
  deletedCount: z.number().int().nonnegative(),
});

export const financialReportPeriodSchema = z.enum(FINANCIAL_REPORT_PERIODS);

export const taxConfigSchema = z.object({
  vatRate: z.number().nonnegative(),
  corporateIncomeTaxRate: z.number().nonnegative(),
  pensionFundRate: z.number().nonnegative(),
  medicalFundRate: z.number().nonnegative(),
  socialInsuranceRate: z.number().nonnegative(),
});

export const revenueSectionSchema = z.object({
  grossRevenue: z.number(),
  netRevenue: z.number(),
  vatCollected: z.number(),
});

export const socialContributionSectionSchema = z.object({
  pensionFund: z.number(),
  medicalFund: z.number(),
  socialInsuranceFund: z.number(),
  otherContributions: z.number(),
  totalSocialContributions: z.number(),
});

export const administrativeExpenseSectionSchema = z.object({
  rent: z.number(),
  utilities: z.number(),
  leasing: z.number(),
  office: z.number(),
  services: z.number(),
  maintenance: z.number(),
  totalAdministrativeExpenses: z.number(),
});

export const taxExpenseSectionSchema = z.object({
  vatToPay: z.number(),
  corporateIncomeTax: z.number(),
  otherTaxes: z.number(),
  totalTaxExpense: z.number(),
});

export const operationalExpenseSectionSchema = z.object({
  materials: z.number(),
  equipment: z.number(),
  transport: z.number(),
  marketing: z.number(),
  software: z.number(),
  totalOperationalExpenses: z.number(),
});

export const otherExpenseSectionSchema = z.object({
  uncategorized: z.number(),
  totalOtherExpenses: z.number(),
});

export const payrollSectionSchema = z.object({
  grossSalaries: z.number(),
  netSalaries: z.number(),
  pensionFund: z.number(),
  medicalFund: z.number(),
  socialInsuranceFund: z.number(),
  totalPayrollTaxes: z.number(),
  totalPayrollCost: z.number(),
});

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

export const vatSectionSchema = z.object({
  vatCollectedFromRevenue: z.number(),
  vatDeductibleFromExpenses: z.number(),
  vatToPay: z.number(),
});

export const corporateResultSectionSchema = z.object({
  netRevenue: z.number(),
  netExpenses: z.number(),
  payrollCost: z.number(),
  operatingProfit: z.number(),
});

export const finalResultSectionSchema = z.object({
  profitBeforeTax: z.number(),
  incomeTax: z.number(),
  profitAfterTax: z.number(),
});

export const financialReportPeriodRangeSchema = z
  .object({
    type: financialReportPeriodSchema,
    startDate: z.iso.date(),
    endDate: z.iso.date(),
  })
  .strict();

export const getFinancialReportRequestSchema = z
  .object({
    userId: z.string().min(1),
    period: financialReportPeriodRangeSchema,
  })
  .strict();

export const getFinancialReportQuerySchema = z
  .object({
    period: financialReportPeriodSchema,
    startDate: z.iso.date(),
    endDate: z.iso.date(),
  })
  .strict();

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

