import type { Model } from 'mongoose';
import { AuditLogRepository } from './audit-log.repository';
import type { AuditLogDocument } from '../schemas/audit-log.schema';
import { buildAuditLogDocument, buildCreateAuditLogRequest } from '../test-fixtures/audit-log.fixture';

describe('AuditLogRepository', () => {
  const auditLogModel = {
    create: jest.fn(),
  };

  let repository: AuditLogRepository;

  beforeEach(() => {
    jest.clearAllMocks();

    repository = new AuditLogRepository(
      auditLogModel as unknown as Model<AuditLogDocument>,
    );
  });

  it('should create audit log', async () => {
    const payload = buildCreateAuditLogRequest();
    const auditLog = buildAuditLogDocument();

    auditLogModel.create.mockResolvedValue(auditLog);

    await expect(repository.create(payload)).resolves.toBe(auditLog);

    expect(auditLogModel.create).toHaveBeenCalledWith(payload);
  });
});
