import { useState } from 'react';
import {
  downloadFinancialReportPdf,
  fetchFinancialReport,
} from '../services/report.api';
import type { FinancialReport, ReportFilters } from '../types/report.types';

export const useFinancialReport = () => {
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [message, setMessage] = useState('');

  const loadReport = async (filters: ReportFilters) => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      setMessage('You must login first.');
      return;
    }

    try {
      const data = await fetchFinancialReport(authToken, filters);
      setReport(data);
      setMessage('');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Could not load financial report.',
      );
    }
  };

  const downloadPdf = async (filters: ReportFilters) => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      setMessage('You must login first.');
      return;
    }

    try {
      await downloadFinancialReportPdf(authToken, filters);
      setMessage('');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Could not download financial report PDF.',
      );
    }
  };

  return {
    report,
    message,
    loadReport,
    downloadPdf,
  };
};
