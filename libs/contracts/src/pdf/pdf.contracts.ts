import { z } from 'zod';
import { financialReportResponseSchema } from '../financial/financial.contracts';

export const generateFinancialReportPdfRequestSchema = z.object({
  userId: z.string().min(1),
  report: financialReportResponseSchema,
});

export type GenerateFinancialReportPdfRequest = z.infer<
  typeof generateFinancialReportPdfRequestSchema
>;

export const generateFinancialReportPdfResponseSchema = z.object({
  fileName: z.string().min(1),
  mimeType: z.literal('application/pdf'),
  contentBase64: z.string().min(1),
});

export type GenerateFinancialReportPdfResponse = z.infer<
  typeof generateFinancialReportPdfResponseSchema
>;
