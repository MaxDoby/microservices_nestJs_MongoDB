import { GetFinancialReportRequest } from '@financial-tracker/contracts';
import { buildFinancialReport } from './financial-report.calculator';
import { TransactionDocument } from '../schemas/transaction.schema';

const buildTransaction = (
  transaction: Partial<TransactionDocument>,
): TransactionDocument => {
  return transaction as TransactionDocument;
};

describe('buildFinancialReport', () => {
  const payload: GetFinancialReportRequest = {
    userId: '6a426f90fcc2f5e584cb060a',
    period: {
      type: 'annual',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
    },
  };

  it('calculates revenue, VAT, expenses and final result', () => {
    const transactions = [
      buildTransaction({
        type: 'income',
        amount: 3800,
        category: 'sales',
      }),
      buildTransaction({
        type: 'expense',
        amount: 2300,
        category: 'rent',
      }),
      buildTransaction({
        type: 'expense',
        amount: 1500,
        category: 'salary',
      }),
    ];

    const report = buildFinancialReport(payload, transactions);

    expect(report.revenue.grossRevenue).toBe(3800);
    expect(report.revenue.netRevenue).toBe(3166.67);
    expect(report.revenue.vatCollected).toBe(633.33);

    expect(report.expenses.grossExpenses).toBe(3800);
    expect(report.expenses.netExpenses).toBe(3416.67);
    expect(report.expenses.vatDeductible).toBe(383.33);

    expect(report.expenses.payrollExpenses.grossSalaries).toBe(1500);
    expect(report.expenses.administrativeExpenses.rent).toBe(2300);

    expect(report.vat.vatToPay).toBe(250);
    expect(report.finalResult.profitBeforeTax).toBe(-250);
    expect(report.finalResult.incomeTax).toBe(0);
    expect(report.finalResult.profitAfterTax).toBe(-250);
  });

  it('applies corporate income tax only for positive profit', () => {
    const transactions = [
      buildTransaction({
        type: 'income',
        amount: 12000,
        category: 'sales',
      }),
      buildTransaction({
        type: 'expense',
        amount: 2400,
        category: 'services',
      }),
    ];

    const report = buildFinancialReport(payload, transactions);

    expect(report.finalResult.profitBeforeTax).toBe(8000);
    expect(report.finalResult.incomeTax).toBe(960);
    expect(report.finalResult.profitAfterTax).toBe(7040);
  });
});
