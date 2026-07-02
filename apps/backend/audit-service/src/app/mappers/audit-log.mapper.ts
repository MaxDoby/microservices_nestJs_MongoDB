import { AuditLogResponse } from '@financial-tracker/contracts';
import { AuditLogDocument } from '../schemas/audit-log.schema';

export const toAuditLogResponse = (
  auditLog: AuditLogDocument,
): AuditLogResponse => ({
  id: auditLog.id,
  actorUserId: auditLog.actorUserId,
  actorEmail: auditLog.actorEmail,
  action: auditLog.action,
  resourceType: auditLog.resourceType,
  resourceId: auditLog.resourceId,
  status: auditLog.status,
  metadata: auditLog.metadata,
  createdAt: auditLog.createdAt.toISOString(),
});
