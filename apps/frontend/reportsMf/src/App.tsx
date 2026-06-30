import { ReportFilters } from './components/ReportFilters';
import { ReportSummary } from './components/ReportSummary';
import { useFinancialReport } from './hooks/useFinancialReport';

export const App = () => {
  const { report, message, loadReport, downloadPdf } = useFinancialReport();

  return (
    <section data-testid="reportsMf" className="panel-stack">
      <div className="section-heading">
        <h2>Reports</h2>
        <p>Generate summaries and PDF financial reports.</p>
      </div>

      <ReportFilters onLoadReport={loadReport} onDownloadPdf={downloadPdf} />

      {message && <p className="status-message">{message}</p>}

      <ReportSummary report={report} />
    </section>
  );
};

export default App;
