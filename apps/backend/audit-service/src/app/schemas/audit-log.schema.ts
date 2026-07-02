import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AuditAction, AuditStatus } from '@financial-tracker/contracts';

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class AuditLog {
  @Prop({ required: true })
  actorUserId!: string;

  @Prop()
  actorEmail?: string;

  @Prop({ required: true, type: String })
  action!: AuditAction;

  @Prop({ required: true })
  resourceType!: string;

  @Prop()
  resourceId?: string;

  @Prop({ required: true, type: String })
  status!: AuditStatus;

  @Prop({ type: Object })
  metadata?: Record<string, unknown>;

  createdAt!: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
