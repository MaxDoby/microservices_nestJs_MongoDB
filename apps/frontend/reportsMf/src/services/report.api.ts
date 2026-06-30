import type { FinancialReport, ReportFilters } from '../types/report.types';

const API_URL = import.meta.env.VITE_API_URL;

const buildReportQuery = (filters: ReportFilters) => {
  const params = new URLSearchParams({
    period: filters.period,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  return params.toString();
};

export const fetchFinancialReport = async (
  authToken: string,
  filters: ReportFilters,
): Promise<FinancialReport> => {
  const query = buildReportQuery(filters);

  const response = await fetch(`${API_URL}/transactions/report?${query}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Could not load financial report.');
  }

  return data;
};

export const downloadFinancialReportPdf = async (
  authToken: string,
  filters: ReportFilters,
): Promise<void> => {
  const query = buildReportQuery(filters);

  const response = await fetch(`${API_URL}/transactions/report/pdf?${query}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

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
