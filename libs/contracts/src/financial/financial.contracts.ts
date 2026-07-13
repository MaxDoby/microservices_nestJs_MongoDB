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

export const createIncomeTransactionBodySchema = z.object({
  type: z.literal('income'),
  amount: z.number().positive(),
  category: incomeCategorySchema,
  description: z.string().optional(),
  date: z.string(),
});

export const createExpenseTransactionBodySchema = z.object({
  type: z.literal('expense'),
  amount: z.number().positive(),
  category: expenseCategorySchema,
  description: z.string().optional(),
  date: z.string(),
});

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

export interface GetTransactionsRequest {
  page: number;
  limit: number;
}

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

export interface DeleteTransactionsRequest {
  transactionIds: string[];
}

export interface DeleteTransactionsResponse {
  deletedCount: number;
}

export type FinancialReportPeriod = 'monthly' | 'quarterly' | 'annual';

export interface TaxConfig {
  vatRate: number;
  corporateIncomeTaxRate: number;
  pensionFundRate: number;
  medicalFundRate: number;
  socialInsuranceRate: number;
}

export interface RevenueSection {
  grossRevenue: number;
  netRevenue: number;
  vatCollected: number;
}

export interface SocialContributionSection {
  pensionFund: number;
  medicalFund: number;
  socialInsuranceFund: number;
  otherContributions: number;
  totalSocialContributions: number;
}

export interface AdministrativeExpenseSection {
  rent: number;
  utilities: number;
  leasing: number;
  office: number;
  services: number;
  maintenance: number;
  totalAdministrativeExpenses: number;
}

export interface TaxExpenseSection {
  vatToPay: number;
  corporateIncomeTax: number;
  otherTaxes: number;
  totalTaxExpense: number;
}

export interface OperationalExpenseSection {
  materials: number;
  equipment: number;
  transport: number;
  marketing: number;
  software: number;
  totalOperationalExpenses: number;
}

export interface OtherExpenseSection {
  uncategorized: number;
  totalOtherExpenses: number;
}

export interface PayrollSection {
  grossSalaries: number;
  netSalaries: number;
  pensionFund: number;
  medicalFund: number;
  socialInsuranceFund: number;
  totalPayrollTaxes: number;
  totalPayrollCost: number;
}

export interface ExpenseSection {
  grossExpenses: number;
  netExpenses: number;
  vatDeductible: number;

  payrollExpenses: PayrollSection;
  socialContributionExpenses: SocialContributionSection;
  administrativeExpenses: AdministrativeExpenseSection;
  taxExpenses: TaxExpenseSection;
  operationalExpenses: OperationalExpenseSection;
  otherExpenses: OtherExpenseSection;
}

export interface VatSection {
  vatCollectedFromRevenue: number;
  vatDeductibleFromExpenses: number;
  vatToPay: number;
}

export interface CorporateResultSection {
  netRevenue: number;
  netExpenses: number;
  payrollCost: number;
  operatingProfit: number;
}

export interface FinalResultSection {
  profitBeforeTax: number;
  incomeTax: number;
  profitAfterTax: number;
}

export interface FinancialReportPeriodRange {
  type: FinancialReportPeriod;
  startDate: string;
  endDate: string;
}

export interface GetFinancialReportRequest {
  userId: string;
  period: FinancialReportPeriodRange;
}

export interface FinancialReportResponse {
  userId: string;
  period: FinancialReportPeriodRange;
  generatedAt: string;

  revenue: RevenueSection;
  expenses: ExpenseSection;
  vat: VatSection;
  corporateResult: CorporateResultSection;
  finalResult: FinalResultSection;
}
