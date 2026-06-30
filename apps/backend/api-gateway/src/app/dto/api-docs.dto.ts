import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code returned by the API Gateway.',
    example: 400,
  })
  statusCode!: number;

  @ApiProperty({
    description: 'Human-readable error message.',
    example: 'Validation failed.',
  })
  message!: string;

  @ApiProperty({
    description: 'Short HTTP error name.',
    example: 'Bad Request',
  })
  error!: string;
}

export class AuthUserDto {
  @ApiProperty({
    description: 'Database identifier of the authenticated user.',
    example: '6a426f90fcc2f5e584cb060a',
  })
  id!: string;

  @ApiProperty({
    description: 'User first name.',
    example: 'Max',
  })
  name!: string;

  @ApiProperty({
    description: 'User surname.',
    example: 'Dobinda',
  })
  surname!: string;

  @ApiProperty({
    description: 'User email used as login identifier.',
    example: 'max@example.com',
  })
  email!: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT token used in the Authorization Bearer header.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  authToken!: string;

  @ApiProperty({
    description: 'Public profile of the authenticated user.',
    type: () => AuthUserDto,
  })
  user!: AuthUserDto;
}

export class JwtPayloadDto {
  @ApiProperty({
    description: 'User identifier stored as JWT subject.',
    example: '6a426f90fcc2f5e584cb060a',
  })
  sub!: string;

  @ApiProperty({
    description: 'Email stored in the JWT payload.',
    example: 'max@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'JWT issued-at timestamp.',
    example: 1782401496,
  })
  iat!: number;

  @ApiProperty({
    description: 'JWT expiration timestamp.',
    example: 1782487896,
  })
  exp!: number;
}

export class ValidateTokenResponseDto {
  @ApiProperty({
    description: 'Indicates whether the token was successfully verified.',
    example: true,
  })
  isValid!: boolean;

  @ApiProperty({
    description: 'Decoded JWT payload for the verified user.',
    type: () => JwtPayloadDto,
  })
  user!: JwtPayloadDto;
}

export class TransactionResponseDto {
  @ApiProperty({
    description: 'Database identifier of the transaction.',
    example: '6a42891dde452d8eb08ec154',
  })
  id!: string;

  @ApiProperty({
    description: 'Identifier of the user who created the transaction.',
    example: '6a426f90fcc2f5e584cb060a',
  })
  userId!: string;

  @ApiProperty({
    description: 'Transaction direction.',
    enum: ['income', 'expense'],
    example: 'income',
  })
  type!: 'income' | 'expense';

  @ApiProperty({
    description: 'Gross transaction amount.',
    example: 1500,
  })
  amount!: number;

  @ApiProperty({
    description: 'Category used in report calculations.',
    example: 'sales',
  })
  category!: string;

  @ApiProperty({
    description: 'Optional transaction note.',
    example: 'June sales income',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Transaction date in ISO format.',
    example: '2026-06-30',
    format: 'date',
  })
  date!: string;
}

export class PaginatedTransactionsResponseDto {
  @ApiProperty({
    description: 'Transactions returned for the requested page.',
    type: () => TransactionResponseDto,
    isArray: true,
  })
  items!: TransactionResponseDto[];

  @ApiProperty({
    description: 'Current page number.',
    example: 1,
  })
  page!: number;

  @ApiProperty({
    description: 'Number of transactions requested per page.',
    example: 20,
  })
  limit!: number;

  @ApiProperty({
    description: 'Total number of transactions in the accounting workspace.',
    example: 42,
  })
  totalItems!: number;

  @ApiProperty({
    description: 'Total available pages.',
    example: 3,
  })
  totalPages!: number;
}

export class DeleteTransactionsResponseDto {
  @ApiProperty({
    description:
      'Number of transactions deleted from the accounting workspace.',
    example: 2,
  })
  deletedCount!: number;
}

export class FinancialReportPeriodRangeDto {
  @ApiProperty({
    description: 'Report period type.',
    enum: ['monthly', 'quarterly', 'annual'],
    example: 'annual',
  })
  type!: 'monthly' | 'quarterly' | 'annual';

  @ApiProperty({
    description: 'Inclusive start date.',
    example: '2026-01-01',
    format: 'date',
  })
  startDate!: string;

  @ApiProperty({
    description: 'Inclusive end date.',
    example: '2026-12-31',
    format: 'date',
  })
  endDate!: string;
}

export class RevenueSectionDto {
  @ApiProperty({ description: 'Total gross revenue.', example: 20300 })
  grossRevenue!: number;

  @ApiProperty({ description: 'Revenue without VAT.', example: 16916.67 })
  netRevenue!: number;

  @ApiProperty({ description: 'VAT collected from revenue.', example: 3383.33 })
  vatCollected!: number;
}

export class PayrollSectionDto {
  @ApiProperty({ description: 'Gross salary expenses.', example: 3000 })
  grossSalaries!: number;

  @ApiProperty({
    description: 'Net salary value after payroll taxes.',
    example: 3000,
  })
  netSalaries!: number;

  @ApiProperty({ description: 'Pension fund contribution.', example: 0 })
  pensionFund!: number;

  @ApiProperty({ description: 'Medical fund contribution.', example: 0 })
  medicalFund!: number;

  @ApiProperty({ description: 'Social insurance contribution.', example: 0 })
  socialInsuranceFund!: number;

  @ApiProperty({ description: 'Total payroll-related taxes.', example: 0 })
  totalPayrollTaxes!: number;

  @ApiProperty({
    description: 'Total payroll cost for the business.',
    example: 3000,
  })
  totalPayrollCost!: number;
}

export class SocialContributionSectionDto {
  @ApiProperty({ description: 'Pension fund contribution.', example: 0 })
  pensionFund!: number;

  @ApiProperty({ description: 'Medical fund contribution.', example: 0 })
  medicalFund!: number;

  @ApiProperty({ description: 'Social insurance contribution.', example: 0 })
  socialInsuranceFund!: number;

  @ApiProperty({ description: 'Other social contributions.', example: 0 })
  otherContributions!: number;

  @ApiProperty({ description: 'Total social contributions.', example: 0 })
  totalSocialContributions!: number;
}

export class AdministrativeExpenseSectionDto {
  @ApiProperty({ description: 'Rent expenses.', example: 2300 })
  rent!: number;

  @ApiProperty({ description: 'Utilities expenses.', example: 0 })
  utilities!: number;

  @ApiProperty({ description: 'Leasing expenses.', example: 0 })
  leasing!: number;

  @ApiProperty({ description: 'Office expenses.', example: 0 })
  office!: number;

  @ApiProperty({ description: 'Administrative services expenses.', example: 0 })
  services!: number;

  @ApiProperty({ description: 'Maintenance expenses.', example: 0 })
  maintenance!: number;

  @ApiProperty({ description: 'Total administrative expenses.', example: 2300 })
  totalAdministrativeExpenses!: number;
}

export class TaxExpenseSectionDto {
  @ApiProperty({
    description: 'VAT payable after deductible VAT.',
    example: 3000,
  })
  vatToPay!: number;

  @ApiProperty({ description: 'Corporate income tax.', example: 1440 })
  corporateIncomeTax!: number;

  @ApiProperty({ description: 'Other tax expenses.', example: 0 })
  otherTaxes!: number;

  @ApiProperty({ description: 'Total tax expense.', example: 4440 })
  totalTaxExpense!: number;
}

export class OperationalExpenseSectionDto {
  @ApiProperty({ description: 'Materials expenses.', example: 0 })
  materials!: number;

  @ApiProperty({ description: 'Equipment expenses.', example: 0 })
  equipment!: number;

  @ApiProperty({ description: 'Transport expenses.', example: 0 })
  transport!: number;

  @ApiProperty({ description: 'Marketing expenses.', example: 0 })
  marketing!: number;

  @ApiProperty({ description: 'Software expenses.', example: 0 })
  software!: number;

  @ApiProperty({ description: 'Total operational expenses.', example: 0 })
  totalOperationalExpenses!: number;
}

export class OtherExpenseSectionDto {
  @ApiProperty({ description: 'Uncategorized expenses.', example: 0 })
  uncategorized!: number;

  @ApiProperty({ description: 'Total other expenses.', example: 0 })
  totalOtherExpenses!: number;
}

export class ExpenseSectionDto {
  @ApiProperty({ description: 'Total gross expenses.', example: 5300 })
  grossExpenses!: number;

  @ApiProperty({
    description: 'Total expenses without deductible VAT.',
    example: 4916.67,
  })
  netExpenses!: number;

  @ApiProperty({
    description: 'VAT deductible from eligible expenses.',
    example: 383.33,
  })
  vatDeductible!: number;

  @ApiProperty({
    description: 'Salary and payroll cost breakdown.',
    type: () => PayrollSectionDto,
  })
  payrollExpenses!: PayrollSectionDto;

  @ApiProperty({
    description: 'Social contribution breakdown.',
    type: () => SocialContributionSectionDto,
  })
  socialContributionExpenses!: SocialContributionSectionDto;

  @ApiProperty({
    description: 'Administrative expense breakdown.',
    type: () => AdministrativeExpenseSectionDto,
  })
  administrativeExpenses!: AdministrativeExpenseSectionDto;

  @ApiProperty({
    description: 'Tax expense breakdown.',
    type: () => TaxExpenseSectionDto,
  })
  taxExpenses!: TaxExpenseSectionDto;

  @ApiProperty({
    description: 'Operational expense breakdown.',
    type: () => OperationalExpenseSectionDto,
  })
  operationalExpenses!: OperationalExpenseSectionDto;

  @ApiProperty({
    description: 'Other expense breakdown.',
    type: () => OtherExpenseSectionDto,
  })
  otherExpenses!: OtherExpenseSectionDto;
}

export class VatSectionDto {
  @ApiProperty({ description: 'VAT collected from revenue.', example: 3383.33 })
  vatCollectedFromRevenue!: number;

  @ApiProperty({
    description: 'VAT deductible from expenses.',
    example: 383.33,
  })
  vatDeductibleFromExpenses!: number;

  @ApiProperty({ description: 'VAT amount to pay.', example: 3000 })
  vatToPay!: number;
}

export class CorporateResultSectionDto {
  @ApiProperty({
    description: 'Net revenue used for corporate result.',
    example: 16916.67,
  })
  netRevenue!: number;

  @ApiProperty({
    description: 'Net expenses used for corporate result.',
    example: 4916.67,
  })
  netExpenses!: number;

  @ApiProperty({ description: 'Total payroll cost.', example: 3000 })
  payrollCost!: number;

  @ApiProperty({
    description: 'Operating profit before income tax.',
    example: 12000,
  })
  operatingProfit!: number;
}

export class FinalResultSectionDto {
  @ApiProperty({
    description: 'Profit before corporate income tax.',
    example: 12000,
  })
  profitBeforeTax!: number;

  @ApiProperty({ description: 'Corporate income tax amount.', example: 1440 })
  incomeTax!: number;

  @ApiProperty({
    description: 'Profit after corporate income tax.',
    example: 10560,
  })
  profitAfterTax!: number;
}

export class FinancialReportResponseDto {
  @ApiProperty({
    description: 'Identifier of the user who generated the report.',
    example: '6a426f90fcc2f5e584cb060a',
  })
  userId!: string;

  @ApiProperty({
    description: 'Requested report period.',
    type: () => FinancialReportPeriodRangeDto,
  })
  period!: FinancialReportPeriodRangeDto;

  @ApiProperty({
    description: 'ISO timestamp when the report was generated.',
    example: '2026-06-29T13:39:17.479Z',
  })
  generatedAt!: string;

  @ApiProperty({
    description: 'Revenue totals.',
    type: () => RevenueSectionDto,
  })
  revenue!: RevenueSectionDto;

  @ApiProperty({
    description: 'Expense totals and grouped breakdown.',
    type: () => ExpenseSectionDto,
  })
  expenses!: ExpenseSectionDto;

  @ApiProperty({
    description: 'VAT calculation summary.',
    type: () => VatSectionDto,
  })
  vat!: VatSectionDto;

  @ApiProperty({
    description: 'Corporate operating result before final tax result.',
    type: () => CorporateResultSectionDto,
  })
  corporateResult!: CorporateResultSectionDto;

  @ApiProperty({
    description: 'Final profit result after income tax.',
    type: () => FinalResultSectionDto,
  })
  finalResult!: FinalResultSectionDto;
}
