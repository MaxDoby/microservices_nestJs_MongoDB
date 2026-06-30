export type FinancialReportPeriod = 'monthly' | 'quarterly' | 'annual';

export interface ReportFilters {
  period: FinancialReportPeriod;
  startDate: string;
  endDate: string;
}

export interface FinancialReport {
  userId: string;
  period: {
    type: FinancialReportPeriod;
    startDate: string;
    endDate: string;
  };
  generatedAt: string;
  revenue: {
    grossRevenue: number;
    netRevenue: number;
    vatCollected: number;
  };
  expenses: {
    grossExpenses: number;
    netExpenses: number;
    vatDeductible: number;
  };
  vat: {
    vatCollectedFromRevenue: number;
    vatDeductibleFromExpenses: number;
    vatToPay: number;
  };
  finalResult: {
    profitBeforeTax: number;
    incomeTax: number;
    profitAfterTax: number;
  };
}
