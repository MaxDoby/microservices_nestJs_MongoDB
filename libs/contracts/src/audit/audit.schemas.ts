import { z } from 'zod';

export const auditActionSchema = z.enum([
  'REGISTER',
  'LOGIN',
  'LOGOUT',
  'CREATE_TRANSACTION',
  'DELETE_TRANSACTIONS',
  'GENERATE_REPORT',
  'DOWNLOAD_REPORT_PDF',
]);

export const auditStatusSchema = z.enum(['success', 'failed']);

export const createAuditLogRequestSchema = z.object({
  actorUserId: z.string().min(1),
  actorEmail: z.email().optional(),
  action: auditActionSchema,
  resourceType: z.string().min(1),
  resourceId: z.string().min(1).optional(),
  status: auditStatusSchema,
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const auditLogResponseSchema = createAuditLogRequestSchema.extend({
  id: z.string().min(1),
  createdAt: z.string().min(1),
});
