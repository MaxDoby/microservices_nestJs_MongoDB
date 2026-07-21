import { createFinancialReportPdfBuffer } from './financial-report-pdf.renderer';
import { buildFinancialReportPdfRequest } from '../test-fixtures/financial-report.fixture';

describe('createFinancialReportPdfBuffer', () => {
  it('should create a valid PDF buffer', async () => {
    const payload = buildFinancialReportPdfRequest();

    const buffer = await createFinancialReportPdfBuffer(payload);

    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(0);
    expect(buffer.subarray(0, 4).toString()).toBe('%PDF');
  });
});
