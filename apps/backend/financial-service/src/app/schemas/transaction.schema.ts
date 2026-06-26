import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TransactionType } from '@financial-tracker/contracts';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true, type: String, enum: ['income', 'expense'] })
  type!: TransactionType;

  @Prop({ required: true })
  amount!: number;

  @Prop({ required: true })
  category!: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  date!: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
