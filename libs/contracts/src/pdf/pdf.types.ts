import { z } from 'zod';
import {
  generateFinancialReportPdfRequestSchema,
  generateFinancialReportPdfResponseSchema,
} from './pdf.schemas';

export type GenerateFinancialReportPdfRequest = z.infer<
  typeof generateFinancialReportPdfRequestSchema
>;

export type GenerateFinancialReportPdfResponse = z.infer<
  typeof generateFinancialReportPdfResponseSchema
>;
