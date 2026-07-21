import { toAuditLogResponse } from './audit-log.mapper';
import {
  buildAuditLogDocument,
  buildAuditLogResponse,
} from '../test-fixtures/audit-log.fixture';

describe('toAuditLogResponse', () => {
  it('should map audit log document to response contract', () => {
    const auditLog = buildAuditLogDocument();

    expect(toAuditLogResponse(auditLog)).toEqual(buildAuditLogResponse());
  });
});
