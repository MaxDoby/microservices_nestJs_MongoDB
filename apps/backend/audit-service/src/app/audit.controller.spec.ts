import { AuditController } from './audit.controller';
import type { AuditService } from './audit.service';
import {
  buildAuditLogResponse,
  buildCreateAuditLogRequest,
} from './test-fixtures/audit-log.fixture';

describe('AuditController', () => {
  let controller: AuditController;
  let auditService: jest.Mocked<Pick<AuditService, 'createLog'>>;

  beforeEach(() => {
    auditService = {
      createLog: jest.fn(),
    };

    controller = new AuditController(auditService as unknown as AuditService);
  });

  it('should delegate audit log creation to AuditService', async () => {
    const payload = buildCreateAuditLogRequest();
    const response = buildAuditLogResponse();

    auditService.createLog.mockResolvedValue(response);

    await expect(controller.createLog(payload)).resolves.toEqual(response);

    expect(auditService.createLog).toHaveBeenCalledWith(payload);
  });
});
