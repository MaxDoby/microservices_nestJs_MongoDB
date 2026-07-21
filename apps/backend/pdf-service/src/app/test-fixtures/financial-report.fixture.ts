import type {
  FinancialReportResponse,
  GenerateFinancialReportPdfRequest,
} from '@financial-tracker/contracts';

export const buildFinancialReport = (): FinancialReportResponse => ({
  userId: '6a426f90fcc2f5e584cb060a',
  period: {
    type: 'annual',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
  },
  generatedAt: '2026-06-29T13:39:17.479Z',
  revenue: {
    grossRevenue: 5300,
    netRevenue: 4416.67,
    vatCollected: 883.33,
  },
  expenses: {
    grossExpenses: 5300,
    netExpenses: 4916.67,
    vatDeductible: 383.33,
    payrollExpenses: {
      grossSalaries: 3000,
      netSalaries: 3000,
      pensionFund: 0,
      medicalFund: 0,
      socialInsuranceFund: 0,
      totalPayrollTaxes: 0,
      totalPayrollCost: 3000,
    },
    socialContributionExpenses: {
      pensionFund: 0,
      medicalFund: 0,
      socialInsuranceFund: 0,
      otherContributions: 0,
      totalSocialContributions: 0,
    },
    administrativeExpenses: {
      rent: 2300,
      utilities: 0,
      leasing: 0,
      office: 0,
      services: 0,
      maintenance: 0,
      totalAdministrativeExpenses: 2300,
    },
    taxExpenses: {
      vatToPay: 500,
      corporateIncomeTax: 0,
      otherTaxes: 0,
      totalTaxExpense: 500,
    },
    operationalExpenses: {
      materials: 0,
      equipment: 0,
      transport: 0,
      marketing: 0,
      software: 0,
      totalOperationalExpenses: 0,
    },
    otherExpenses: {
      uncategorized: 0,
      totalOtherExpenses: 0,
    },
  },
  vat: {
    vatCollectedFromRevenue: 883.33,
    vatDeductibleFromExpenses: 383.33,
    vatToPay: 500,
  },
  corporateResult: {
    netRevenue: 4416.67,
    netExpenses: 4916.67,
    payrollCost: 3000,
    operatingProfit: -500,
  },
  finalResult: {
    profitBeforeTax: -500,
    incomeTax: 0,
    profitAfterTax: -500,
  },
});

export const buildFinancialReportPdfRequest =
  (): GenerateFinancialReportPdfRequest => {
    const report = buildFinancialReport();

    return {
      userId: report.userId,
      report,
    };
  };
