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

export const INCOME_CATEGORIES = [
  'sales',
  'services',
  'consulting',
  'other',
] as const;

export const TRANSACTION_CATEGORIES = [
  ...EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES,
] as const;

export const FINANCIAL_REPORT_PERIODS = [
  'monthly',
  'quarterly',
  'annual',
] as const;
