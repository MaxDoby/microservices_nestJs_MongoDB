import { IsIn, IsISO8601 } from 'class-validator';
import { FinancialReportPeriod } from '@financial-tracker/contracts';
import { ApiProperty } from '@nestjs/swagger';

export class GetFinancialReportQueryDto {
  @ApiProperty({
    description: 'Requested report aggregation period.',
    enum: ['monthly', 'quarterly', 'annual'],
    example: 'annual',
  })
  @IsIn(['monthly', 'quarterly', 'annual'])
  period!: FinancialReportPeriod;

  @ApiProperty({
    description: 'Inclusive report start date in ISO format.',
    example: '2026-01-01',
    format: 'date',
  })
  @IsISO8601({ strict: true })
  startDate!: string;

  @ApiProperty({
    description: 'Inclusive report end date in ISO format.',
    example: '2026-12-31',
    format: 'date',
  })
  @IsISO8601({ strict: true })
  endDate!: string;
}
