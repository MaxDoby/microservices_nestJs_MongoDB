import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  type ExpenseCategory,
  type IncomeCategory,
  type TransactionCategory,
  type TransactionType,
} from '@financial-tracker/contracts';

export type {
  ExpenseCategory,
  IncomeCategory,
  TransactionCategory,
  TransactionType,
};

export const incomeCategories: IncomeCategory[] = [...INCOME_CATEGORIES];
export const expenseCategories: ExpenseCategory[] = [...EXPENSE_CATEGORIES];
