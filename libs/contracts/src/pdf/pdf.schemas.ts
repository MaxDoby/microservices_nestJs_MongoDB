import { z } from 'zod';
import { financialReportResponseSchema } from '../financial/financial.schemas';

export const generateFinancialReportPdfRequestSchema = z.object({
  userId: z.string().min(1),
  report: financialReportResponseSchema,
});

export const generateFinancialReportPdfResponseSchema = z.object({
  fileName: z.string().min(1),
  mimeType: z.literal('application/pdf'),
  contentBase64: z.string().min(1),
});
