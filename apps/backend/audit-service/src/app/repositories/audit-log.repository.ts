import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuditLogRequest } from '@financial-tracker/contracts';
import { AuditLog, AuditLogDocument } from '../schemas/audit-log.schema';

@Injectable()
export class AuditLogRepository {
  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLogDocument>,
  ) {}

  create(payload: CreateAuditLogRequest): Promise<AuditLogDocument> {
    return this.auditLogModel.create(payload);
  }
}
