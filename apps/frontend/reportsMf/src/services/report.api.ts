import type { FinancialReport, ReportFilters } from '../types/report.types';
import { authenticatedFetch } from '@financial-tracker/frontend-auth';

const buildReportQuery = (filters: ReportFilters) => {
  const params = new URLSearchParams({
    period: filters.period,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  return params.toString();
};

export const fetchFinancialReport = async (
  filters: ReportFilters,
): Promise<FinancialReport> => {
  const query = buildReportQuery(filters);

  const response = await authenticatedFetch(`/transactions/report?${query}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Could not load financial report.');
  }

  return data;
};

export const downloadFinancialReportPdf = async (
  filters: ReportFilters,
): Promise<void> => {
  const query = buildReportQuery(filters);

  const response = await authenticatedFetch(
    `/transactions/report/pdf?${query}`,
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message ?? 'Could not download financial report PDF.');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `financial-report-${filters.startDate}-${filters.endDate}.pdf`;
  link.click();

  window.URL.revokeObjectURL(url);
};
