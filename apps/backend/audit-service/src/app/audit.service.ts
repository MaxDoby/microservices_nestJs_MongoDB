import { Injectable } from '@nestjs/common';
import {
  AuditLogResponse,
  CreateAuditLogRequest,
} from '@financial-tracker/contracts';
import { AuditLogRepository } from './repositories/audit-log.repository';
import { toAuditLogResponse } from './mappers/audit-log.mapper';

@Injectable()
export class AuditService {
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  async createLog(payload: CreateAuditLogRequest): Promise<AuditLogResponse> {
    const auditLog = await this.auditLogRepository.create(payload);

    return toAuditLogResponse(auditLog);
  }
}
