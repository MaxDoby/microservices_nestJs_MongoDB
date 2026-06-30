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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Transaction direction. Income increases revenue, expense decreases profit.',
    enum: ['income', 'expense'],
    example: 'income',
  })
  @IsIn(['income', 'expense'])
  type!: TransactionType;

  @ApiProperty({
    description: 'Gross transaction amount. The current report model treats amounts as VAT-inclusive where VAT applies.',
    example: 1500,
    minimum: 0.01,
  })
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiProperty({
    description: 'Business category used by reports to group revenue, expenses, payroll and VAT calculations.',
    enum: [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES],
    example: 'sales',
  })
  @IsIn([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])
  category!: TransactionCategory;

  @ApiPropertyOptional({
    description: 'Optional free-text note for the transaction.',
    example: 'June salary payment',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Transaction date in ISO format. Reports filter transactions by this value.',
    example: '2026-06-30',
    format: 'date',
  })
  @IsISO8601({ strict: true })
  date!: string;
}
