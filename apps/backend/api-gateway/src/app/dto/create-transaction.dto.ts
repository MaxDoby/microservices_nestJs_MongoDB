import {
  IsIn,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  TransactionType,
  TransactionCategory,
} from '@financial-tracker/contracts';

export class CreateTransactionDto {
  @IsIn(['income', 'expense'])
  type!: TransactionType;

  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsIn([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])
  category!: TransactionCategory;

  @IsOptional()
  @IsString()
  description?: string;

  @IsISO8601({ strict: true })
  date!: string;
}
