import { PdfController } from './pdf.controller';
import type { PdfService } from './pdf.service';
import { buildFinancialReportPdfRequest } from './test-fixtures/financial-report.fixture';

describe('PdfController', () => {
  const pdfService = {
    generateFinancialReport: jest.fn(),
  };

  let controller: PdfController;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new PdfController(pdfService as unknown as PdfService);
  });

  it('delegates financial report PDF payload to pdf service', async () => {
    const payload = buildFinancialReportPdfRequest();
    const response = {
      fileName: `financial-report-${payload.userId}.pdf`,
      mimeType: 'application/pdf' as const,
      contentBase64: Buffer.from('%PDF').toString('base64'),
    };

    pdfService.generateFinancialReport.mockResolvedValue(response);

    await expect(controller.generateFinancialReport(payload)).resolves.toEqual(
      response,
    );
    expect(pdfService.generateFinancialReport).toHaveBeenCalledWith(payload);
  });
});
