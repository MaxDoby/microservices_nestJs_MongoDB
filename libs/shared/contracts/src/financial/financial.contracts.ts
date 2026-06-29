export type TransactionType = 'income' | 'expense';

export interface CreateIncomeTransactionRequest {
  userId: string;
  type: 'income';
  amount: number;
  category: IncomeCategory;
  description?: string;
  date: string;
}

export interface CreateExpenseTransactionRequest {
  userId: string;
  type: 'expense';
  amount: number;
  category: ExpenseCategory;
  description?: string;
  date: string;
}

export type CreateTransactionRequest =
  | CreateIncomeTransactionRequest
  | CreateExpenseTransactionRequest;

export interface CreateIncomeTransactionBody {
  type: 'income';
  amount: number;
  category: IncomeCategory;
  description?: string;
  date: string;
}

export interface CreateExpenseTransactionBody {
  type: 'expense';
  amount: number;
  category: ExpenseCategory;
  description?: string;
  date: string;
}

export type CreateTransactionBody =
  | CreateIncomeTransactionBody
  | CreateExpenseTransactionBody;

export interface TransactionResponse {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description?: string;
  date: string;
}

export interface GetTransactionsRequest {
  userId: string;
}

export interface GetFinancialSummaryRequest {
  userId: string;
}

export interface FinancialSummaryResponse {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  estimatedTax: number;
}

export type FinancialReportPeriod = 'monthly' | 'quarterly' | 'annual';

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

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const INCOME_CATEGORIES = [
  'sales',
  'services',
  'consulting',
  'other',
] as const;

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];

export const TRANSACTION_CATEGORIES = [
  ...EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES,
] as const;

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];

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
