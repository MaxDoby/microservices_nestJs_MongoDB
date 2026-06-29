import { FinancialReportResponse } from '../financial/financial.contracts';

export interface GenerateFinancialReportPdfRequest {
  userId: string;
  report: FinancialReportResponse;
}

export interface GenerateFinancialReportPdfResponse {
  fileName: string;
  mimeType: 'application/pdf';
  contentBase64: string;
}
