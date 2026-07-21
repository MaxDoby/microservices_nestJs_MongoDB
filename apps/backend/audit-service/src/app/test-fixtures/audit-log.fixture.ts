import type {
  AuditLogResponse,
  CreateAuditLogRequest,
} from '@financial-tracker/contracts';
import type { AuditLogDocument } from '../schemas/audit-log.schema';

export const buildCreateAuditLogRequest = (): CreateAuditLogRequest => ({
  actorUserId: '6a426f90fcc2f5e584cb060a',
  actorEmail: 'max@max.com',
  action: 'CREATE_TRANSACTION',
  resourceType: 'transaction',
  resourceId: '6a42891dde452d8eb08ec154',
  status: 'success',
  metadata: {
    transactionType: 'income',
    amount: 1500,
  },
});

export const buildAuditLogDocument = (): AuditLogDocument =>
  ({
    id: '6a42891dde452d8eb08ec155',
    ...buildCreateAuditLogRequest(),
    createdAt: new Date('2026-07-13T10:00:00.000Z'),
  }) as AuditLogDocument;

export const buildAuditLogResponse = (): AuditLogResponse => ({
  id: '6a42891dde452d8eb08ec155',
  ...buildCreateAuditLogRequest(),
  createdAt: '2026-07-13T10:00:00.000Z',
});
