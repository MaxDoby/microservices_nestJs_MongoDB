import { useState } from 'react';
import type { ReportFilters as ReportFiltersValue } from '../types/report.types';

type ReportPeriod = ReportFiltersValue['period'];

interface ReportFiltersProps {
  onLoadReport: (filters: ReportFiltersValue) => Promise<void>;
  onDownloadPdf: (filters: ReportFiltersValue) => Promise<void>;
}

export const ReportFilters = ({
  onLoadReport,
  onDownloadPdf,
}: ReportFiltersProps) => {
  const [period, setPeriod] = useState<ReportPeriod>('annual');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');

  const getFilters = (): ReportFiltersValue => ({
    period,
    startDate,
    endDate,
  });

  const handleLoadReport = async () => {
    await onLoadReport(getFilters());
  };

  const handleDownloadPdf = async () => {
    await onDownloadPdf(getFilters());
  };

  return (
    <section className="toolbar">
      <select
        value={period}
        onChange={(event) =>
          setPeriod(event.target.value as ReportPeriod)
        }
      >
        <option value="monthly">Monthly</option>
        <option value="quarterly">Quarterly</option>
        <option value="annual">Annual</option>
      </select>

      <input
        type="date"
        value={startDate}
        onChange={(event) => setStartDate(event.target.value)}
      />

      <input
        type="date"
        value={endDate}
        onChange={(event) => setEndDate(event.target.value)}
      />

      <button type="button" onClick={handleLoadReport}>
        Generate Report
      </button>

      <button type="button" onClick={handleDownloadPdf}>
        Download PDF
      </button>
    </section>
  );
};
