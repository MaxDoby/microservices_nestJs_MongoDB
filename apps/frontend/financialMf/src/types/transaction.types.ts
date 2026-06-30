export type TransactionType = 'income' | 'expense';

export type IncomeCategory = 'sales' | 'services' | 'consulting' | 'other';

export type ExpenseCategory =
  | 'salary'
  | 'rent'
  | 'utilities'
  | 'leasing'
  | 'office'
  | 'services'
  | 'maintenance'
  | 'materials'
  | 'equipment'
  | 'transport'
  | 'marketing'
  | 'software'
  | 'other';

export type TransactionCategory = IncomeCategory | ExpenseCategory;

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description?: string;
  date: string;
}

export interface PaginatedTransactions {
  items: Transaction[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export const incomeCategories: IncomeCategory[] = [
  'sales',
  'services',
  'consulting',
  'other',
];

export const expenseCategories: ExpenseCategory[] = [
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
];

export interface CreateTransactionPayload {
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description?: string;
  date: string;
}

export interface DeleteTransactionsPayload {
  transactionIds: string[];
}
