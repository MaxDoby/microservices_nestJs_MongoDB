import type { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { buildFinancialReportPdfRequest } from './test-fixtures/financial-report.fixture';

describe('PdfController', () => {
  let controller: PdfController;
  let pdfService: jest.Mocked<Pick<PdfService, 'generateFinancialReport'>>;

  beforeEach(() => {
    pdfService = {
      generateFinancialReport: jest.fn(),
    };

    controller = new PdfController(pdfService as PdfService);
  });

  it('should delegate financial report PDF generation to PdfService', async () => {
    const payload = buildFinancialReportPdfRequest();
    const response = {
      fileName: `financial-report-${payload.userId}.pdf`,
      mimeType: 'application/pdf' as const,
      contentBase64: Buffer.from('%PDF test content').toString('base64'),
    };

    pdfService.generateFinancialReport.mockResolvedValue(response);

    await expect(controller.generateFinancialReport(payload)).resolves.toEqual(
      response,
    );

    expect(pdfService.generateFinancialReport).toHaveBeenCalledWith(payload);
  });
});
