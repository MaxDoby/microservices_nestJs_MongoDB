import { AuditService } from './audit.service';
import type { AuditLogRepository } from './repositories/audit-log.repository';
import {
  buildAuditLogDocument,
  buildAuditLogResponse,
  buildCreateAuditLogRequest,
} from './test-fixtures/audit-log.fixture';

describe('AuditService', () => {
  let service: AuditService;
  let auditLogRepository: jest.Mocked<Pick<AuditLogRepository, 'create'>>;

  beforeEach(() => {
    auditLogRepository = {
      create: jest.fn(),
    };

    service = new AuditService(
      auditLogRepository as unknown as AuditLogRepository,
    );
  });

  it('should create audit log and return mapped response', async () => {
    const payload = buildCreateAuditLogRequest();
    const auditLog = buildAuditLogDocument();

    auditLogRepository.create.mockResolvedValue(auditLog);

    await expect(service.createLog(payload)).resolves.toEqual(
      buildAuditLogResponse(),
    );

    expect(auditLogRepository.create).toHaveBeenCalledWith(payload);
  });
});
