import { GenerateFinancialReportPdfResponse } from '@financial-tracker/contracts';
import { PdfHttpResponse } from '../types/http-response.types';

export const sendPdfResponse = (
  response: PdfHttpResponse,
  pdf: GenerateFinancialReportPdfResponse,
): void => {
  const pdfBuffer = Buffer.from(pdf.contentBase64, 'base64');

  response.setHeader('Content-Type', pdf.mimeType);
  response.setHeader(
    'Content-Disposition',
    `attachment; filename="${pdf.fileName}"`,
  );

  response.send(pdfBuffer);
};
