import type {
  FinancialReportPeriod,
  FinancialReportResponse,
} from '@financial-tracker/contracts';

export interface ReportFilters {
  period: FinancialReportPeriod;
  startDate: string;
  endDate: string;
}

export type FinancialReport = FinancialReportResponse;
