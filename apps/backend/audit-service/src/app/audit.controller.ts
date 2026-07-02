import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AUDIT_PATTERNS,
  AuditLogResponse,
  CreateAuditLogRequest,
} from '@financial-tracker/contracts';
import { AuditService } from './audit.service';

@Controller()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @MessagePattern(AUDIT_PATTERNS.CREATE_LOG)
  createLog(
    @Payload() payload: CreateAuditLogRequest,
  ): Promise<AuditLogResponse> {
    return this.auditService.createLog(payload);
  }
}
