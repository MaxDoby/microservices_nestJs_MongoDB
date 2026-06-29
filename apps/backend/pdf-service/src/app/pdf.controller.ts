import { Controller } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  GenerateFinancialReportPdfRequest,
  GenerateFinancialReportPdfResponse,
  PDF_PATTERNS,
} from '@financial-tracker/contracts';

@Controller()
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @MessagePattern(PDF_PATTERNS.GENERATE_FINANCIAL_REPORT)
  generateFinancialReport(
    @Payload() payload: GenerateFinancialReportPdfRequest,
  ): Promise<GenerateFinancialReportPdfResponse> {
    return this.pdfService.generateFinancialReport(payload);
  }
}
