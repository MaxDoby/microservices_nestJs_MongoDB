import type {
  FinancialControllerGetFinancialReportData,
  FinancialReportResponseDto,
} from '@financial-tracker/generated-api';

export type FinancialReport = FinancialReportResponseDto;
export type ReportFilters = FinancialControllerGetFinancialReportData['query'];
