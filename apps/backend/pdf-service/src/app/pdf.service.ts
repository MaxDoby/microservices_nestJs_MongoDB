import { Injectable } from '@nestjs/common';
import {
  GenerateFinancialReportPdfRequest,
  GenerateFinancialReportPdfResponse,
} from '@financial-tracker/contracts';
import { createFinancialReportPdfBuffer } from './renderers/financial-report-pdf.renderer';

@Injectable()
export class PdfService {
  async generateFinancialReport(
    payload: GenerateFinancialReportPdfRequest,
  ): Promise<GenerateFinancialReportPdfResponse> {
    const buffer = await createFinancialReportPdfBuffer(payload);

    return {
      fileName: `financial-report-${payload.userId}.pdf`,
      mimeType: 'application/pdf',
      contentBase64: buffer.toString('base64'),
    };
  }
}
