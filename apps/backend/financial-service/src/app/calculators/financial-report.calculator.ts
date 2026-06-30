import {
  ExpenseCategory,
  FinancialReportResponse,
  GetFinancialReportRequest,
  TaxConfig,
} from '@financial-tracker/contracts';
import { TransactionDocument } from '../schemas/transaction.schema';

const roundMoney = (value: number): number => {
  return Math.round(value * 100) / 100;
};

export const buildFinancialReport = (
  payload: GetFinancialReportRequest,
  transactions: TransactionDocument[],
): FinancialReportResponse => {
  const taxConfig: TaxConfig = {
    vatRate: 0.2,
    corporateIncomeTaxRate: 0.12,
    pensionFundRate: 0,
    medicalFundRate: 0,
    socialInsuranceRate: 0,
  };

  const incomeTransactions = transactions.filter(
    (transaction) => transaction.type === 'income',
  );

  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === 'expense',
  );

  const sumExpenseByCategory = (category: ExpenseCategory): number =>
    expenseTransactions
      .filter((transaction) => transaction.category === category)
      .reduce((sum, transaction) => sum + transaction.amount, 0);

  const grossSalaries = sumExpenseByCategory('salary');

  const grossRent = sumExpenseByCategory('rent');
  const grossUtilities = sumExpenseByCategory('utilities');
  const grossLeasing = sumExpenseByCategory('leasing');
  const grossOffice = sumExpenseByCategory('office');
  const grossServices = sumExpenseByCategory('services');
  const grossMaintenance = sumExpenseByCategory('maintenance');

  const grossMaterials = sumExpenseByCategory('materials');
  const grossEquipment = sumExpenseByCategory('equipment');
  const grossTransport = sumExpenseByCategory('transport');
  const grossMarketing = sumExpenseByCategory('marketing');
  const grossSoftware = sumExpenseByCategory('software');

  const uncategorizedExpenses = sumExpenseByCategory('other');
  const totalOtherExpenses = uncategorizedExpenses;

  const totalOperationalExpenses =
    grossMaterials +
    grossEquipment +
    grossTransport +
    grossMarketing +
    grossSoftware;

  const totalAdministrativeExpenses =
    grossRent +
    grossUtilities +
    grossLeasing +
    grossOffice +
    grossServices +
    grossMaintenance;

  const pensionFund = grossSalaries * taxConfig.pensionFundRate;
  const medicalFund = grossSalaries * taxConfig.medicalFundRate;
  const socialInsuranceFund = grossSalaries * taxConfig.socialInsuranceRate;
  const totalPayrollTaxes = pensionFund + medicalFund + socialInsuranceFund;
  const totalPayrollCost = grossSalaries + totalPayrollTaxes;
  const netSalaries = grossSalaries - totalPayrollTaxes;

  const grossRevenue = incomeTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );

  const netRevenue = grossRevenue / (1 + taxConfig.vatRate);

  const grossVatEligibleExpenses =
    totalAdministrativeExpenses + totalOperationalExpenses;

  const netVatEligibleExpenses =
    grossVatEligibleExpenses / (1 + taxConfig.vatRate);

  const grossNonVatExpenses =
    grossSalaries + totalPayrollTaxes + totalOtherExpenses;

  const grossExpenses = grossVatEligibleExpenses + grossNonVatExpenses;
  const netExpenses = netVatEligibleExpenses + grossNonVatExpenses;

  const vatCollected = grossRevenue - netRevenue;
  const vatDeductible = grossVatEligibleExpenses - netVatEligibleExpenses;
  const vatToPay = vatCollected - vatDeductible;

  const payrollCost = totalPayrollCost;
  const operatingProfit = netRevenue - netExpenses;
  const taxableProfit = Math.max(operatingProfit, 0);
  const incomeTax = taxableProfit * taxConfig.corporateIncomeTaxRate;
  const profitAfterTax = operatingProfit - incomeTax;

  const otherTaxes = 0;
  const totalTaxExpense = vatToPay + incomeTax + otherTaxes;

  return {
    userId: payload.userId,
    period: payload.period,
    generatedAt: new Date().toISOString(),

    revenue: {
      grossRevenue: roundMoney(grossRevenue),
      netRevenue: roundMoney(netRevenue),
      vatCollected: roundMoney(vatCollected),
    },

    expenses: {
      grossExpenses: roundMoney(grossExpenses),
      netExpenses: roundMoney(netExpenses),
      vatDeductible: roundMoney(vatDeductible),

      payrollExpenses: {
        grossSalaries: roundMoney(grossSalaries),
        netSalaries: roundMoney(netSalaries),
        pensionFund: roundMoney(pensionFund),
        medicalFund: roundMoney(medicalFund),
        socialInsuranceFund: roundMoney(socialInsuranceFund),
        totalPayrollTaxes: roundMoney(totalPayrollTaxes),
        totalPayrollCost: roundMoney(totalPayrollCost),
      },

      socialContributionExpenses: {
        pensionFund: roundMoney(pensionFund),
        medicalFund: roundMoney(medicalFund),
        socialInsuranceFund: roundMoney(socialInsuranceFund),
        otherContributions: 0,
        totalSocialContributions: roundMoney(totalPayrollTaxes),
      },

      administrativeExpenses: {
        rent: roundMoney(grossRent),
        utilities: roundMoney(grossUtilities),
        leasing: roundMoney(grossLeasing),
        office: roundMoney(grossOffice),
        services: roundMoney(grossServices),
        maintenance: roundMoney(grossMaintenance),
        totalAdministrativeExpenses: roundMoney(totalAdministrativeExpenses),
      },

      taxExpenses: {
        vatToPay: roundMoney(vatToPay),
        corporateIncomeTax: roundMoney(incomeTax),
        otherTaxes: roundMoney(otherTaxes),
        totalTaxExpense: roundMoney(totalTaxExpense),
      },

      operationalExpenses: {
        materials: roundMoney(grossMaterials),
        equipment: roundMoney(grossEquipment),
        transport: roundMoney(grossTransport),
        marketing: roundMoney(grossMarketing),
        software: roundMoney(grossSoftware),
        totalOperationalExpenses: roundMoney(totalOperationalExpenses),
      },

      otherExpenses: {
        uncategorized: roundMoney(uncategorizedExpenses),
        totalOtherExpenses: roundMoney(totalOtherExpenses),
      },
    },

    vat: {
      vatCollectedFromRevenue: roundMoney(vatCollected),
      vatDeductibleFromExpenses: roundMoney(vatDeductible),
      vatToPay: roundMoney(vatToPay),
    },

    corporateResult: {
      netRevenue: roundMoney(netRevenue),
      netExpenses: roundMoney(netExpenses),
      payrollCost: roundMoney(payrollCost),
      operatingProfit: roundMoney(operatingProfit),
    },

    finalResult: {
      profitBeforeTax: roundMoney(operatingProfit),
      incomeTax: roundMoney(incomeTax),
      profitAfterTax: roundMoney(profitAfterTax),
    },
  };
};
