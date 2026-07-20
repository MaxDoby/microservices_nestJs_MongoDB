import { z } from 'zod';
import {
  auditActionSchema,
  auditLogResponseSchema,
  auditStatusSchema,
  createAuditLogRequestSchema,
} from './audit.schemas';

export type AuditAction = z.infer<typeof auditActionSchema>;

export type AuditStatus = z.infer<typeof auditStatusSchema>;

export type CreateAuditLogRequest = z.infer<typeof createAuditLogRequestSchema>;

export type AuditLogResponse = z.infer<typeof auditLogResponseSchema>;
