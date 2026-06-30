import type { FinancialReport } from '../types/report.types';

interface ReportSummaryProps {
  report: FinancialReport | null;
}

export const ReportSummary = ({ report }: ReportSummaryProps) => {
  if (!report) {
    return <p>No report loaded.</p>;
  }

  return (
    <section className="report-summary">
      <h3>Report summary</h3>

      <p>
        Period: {report.period.startDate} - {report.period.endDate}
      </p>

      <ul className="metric-list">
        <li>
          <span>Gross revenue</span>
          <strong>{report.revenue.grossRevenue}</strong>
        </li>
        <li>
          <span>Net revenue</span>
          <strong>{report.revenue.netRevenue}</strong>
        </li>
        <li>
          <span>VAT collected</span>
          <strong>{report.revenue.vatCollected}</strong>
        </li>
        <li>
          <span>Gross expenses</span>
          <strong>{report.expenses.grossExpenses}</strong>
        </li>
        <li>
          <span>Net expenses</span>
          <strong>{report.expenses.netExpenses}</strong>
        </li>
        <li>
          <span>VAT to pay</span>
          <strong>{report.vat.vatToPay}</strong>
        </li>
        <li>
          <span>Profit before tax</span>
          <strong>{report.finalResult.profitBeforeTax}</strong>
        </li>
        <li>
          <span>Income tax</span>
          <strong>{report.finalResult.incomeTax}</strong>
        </li>
        <li>
          <span>Profit after tax</span>
          <strong>{report.finalResult.profitAfterTax}</strong>
        </li>
      </ul>
    </section>
  );
};
