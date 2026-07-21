import { PdfService } from './pdf.service';
import { createFinancialReportPdfBuffer } from './renderers/financial-report-pdf.renderer';
import { buildFinancialReportPdfRequest } from './test-fixtures/financial-report.fixture';

jest.mock('./renderers/financial-report-pdf.renderer', () => ({
  createFinancialReportPdfBuffer: jest.fn(),
}));

const mockedCreateFinancialReportPdfBuffer =
  createFinancialReportPdfBuffer as jest.MockedFunction<
    typeof createFinancialReportPdfBuffer
  >;

describe('PdfService', () => {
  let service: PdfService;

  beforeEach(() => {
    service = new PdfService();
    jest.clearAllMocks();
  });

  it('should generate a financial report PDF response', async () => {
    const payload = buildFinancialReportPdfRequest();
    const pdfBuffer = Buffer.from('%PDF test content');

    mockedCreateFinancialReportPdfBuffer.mockResolvedValue(pdfBuffer);

    const result = await service.generateFinancialReport(payload);

    expect(mockedCreateFinancialReportPdfBuffer).toHaveBeenCalledWith(payload);
    expect(result).toEqual({
      fileName: `financial-report-${payload.userId}.pdf`,
      mimeType: 'application/pdf',
      contentBase64: pdfBuffer.toString('base64'),
    });
  });
});
