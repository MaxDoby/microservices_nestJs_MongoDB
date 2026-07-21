import { AuditController } from './audit.controller';
import type { AuditService } from './audit.service';
import {
  buildAuditLogResponse,
  buildCreateAuditLogRequest,
} from './test-fixtures/audit-log.fixture';

describe('AuditController', () => {
  const auditService = {
    createLog: jest.fn(),
  };

  let controller: AuditController;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new AuditController(auditService as unknown as AuditService);
  });

  it('delegates audit log payload to audit service', async () => {
    const payload = buildCreateAuditLogRequest();
    const response = buildAuditLogResponse();

    auditService.createLog.mockResolvedValue(response);

    await expect(controller.createLog(payload)).resolves.toEqual(response);
    expect(auditService.createLog).toHaveBeenCalledWith(payload);
  });
});
