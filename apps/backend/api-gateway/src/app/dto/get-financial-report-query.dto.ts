import { IsIn, IsISO8601 } from 'class-validator';
import { FinancialReportPeriod } from '@financial-tracker/contracts';

export class GetFinancialReportQueryDto {
  @IsIn(['monthly', 'quarterly', 'annual'])
  period!: FinancialReportPeriod;

  @IsISO8601({ strict: true })
  startDate!: string;

  @IsISO8601({ strict: true })
  endDate!: string;
}
