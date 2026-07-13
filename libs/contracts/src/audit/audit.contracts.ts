export type AuditAction =
  | 'REGISTER'
  | 'LOGIN'
  | 'LOGOUT'
  | 'CREATE_TRANSACTION'
  | 'DELETE_TRANSACTIONS'
  | 'GENERATE_REPORT'
  | 'DOWNLOAD_REPORT_PDF';

export type AuditStatus = 'success' | 'failed';

export interface CreateAuditLogRequest {
  actorUserId: string;
  actorEmail?: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  status: AuditStatus;
  metadata?: Record<string, unknown>;
}

export interface AuditLogResponse {
  id: string;
  actorUserId: string;
  actorEmail?: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  status: AuditStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
