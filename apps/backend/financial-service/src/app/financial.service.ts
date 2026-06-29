import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateTransactionRequest,
  GetTransactionsRequest,
  TransactionResponse,
  FinancialSummaryResponse,
  GetFinancialSummaryRequest,
  FinancialReportResponse,
  GetFinancialReportRequest,
  TaxConfig,
  ExpenseCategory,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '@financial-tracker/contracts';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class FinancialService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {}

  private roundMoney(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private validateTransactionCategory(payload: CreateTransactionRequest): void {
    if (
      payload.type === 'income' &&
      !INCOME_CATEGORIES.includes(payload.category)
    ) {
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid income category.',
      });
    }

    if (
      payload.type === 'expense' &&
      !EXPENSE_CATEGORIES.includes(payload.category)
    ) {
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid expense category.',
      });
    }
  }

  async createTransaction(
    payload: CreateTransactionRequest,
  ): Promise<TransactionResponse> {
    this.validateTransactionCategory(payload);
    const transaction = await this.transactionModel.create(payload);

    return {
      id: transaction.id,
      userId: transaction.userId,
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      date: transaction.date,
    };
  }

  async getTransactions(
    payload: GetTransactionsRequest,
  ): Promise<TransactionResponse[]> {
    const transactions = await this.transactionModel.find({
      userId: payload.userId,
    });

    return transactions.map((transaction) => ({
      id: transaction.id,
      userId: transaction.userId,
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      date: transaction.date,
    }));
  }

  async getSummary(
    payload: GetFinancialSummaryRequest,
  ): Promise<FinancialSummaryResponse> {
    const transactions = await this.transactionModel.find({
      userId: payload.userId,
    });

    const totalIncome = transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalExpense = transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const balance = totalIncome - totalExpense;
    const estimatedTax = totalIncome * 0.12;

    return {
      totalIncome,
      totalExpense,
      balance,
      estimatedTax,
    };
  }

  async getReport(
    payload: GetFinancialReportRequest,
  ): Promise<FinancialReportResponse> {
    const transactions = await this.transactionModel.find({
      userId: payload.userId,
      date: {
        $gte: payload.period.startDate,
        $lte: payload.period.endDate,
      },
    });

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
        grossRevenue: this.roundMoney(grossRevenue),
        netRevenue: this.roundMoney(netRevenue),
        vatCollected: this.roundMoney(vatCollected),
      },

      expenses: {
        grossExpenses: this.roundMoney(grossExpenses),
        netExpenses: this.roundMoney(netExpenses),
        vatDeductible: this.roundMoney(vatDeductible),

        payrollExpenses: {
          grossSalaries: this.roundMoney(grossSalaries),
          netSalaries: this.roundMoney(netSalaries),
          pensionFund: this.roundMoney(pensionFund),
          medicalFund: this.roundMoney(medicalFund),
          socialInsuranceFund: this.roundMoney(socialInsuranceFund),
          totalPayrollTaxes: this.roundMoney(totalPayrollTaxes),
          totalPayrollCost: this.roundMoney(totalPayrollCost),
        },

        socialContributionExpenses: {
          pensionFund: this.roundMoney(pensionFund),
          medicalFund: this.roundMoney(medicalFund),
          socialInsuranceFund: this.roundMoney(socialInsuranceFund),
          otherContributions: 0,
          totalSocialContributions: this.roundMoney(totalPayrollTaxes),
        },

        administrativeExpenses: {
          rent: this.roundMoney(grossRent),
          utilities: this.roundMoney(grossUtilities),
          leasing: this.roundMoney(grossLeasing),
          office: this.roundMoney(grossOffice),
          services: this.roundMoney(grossServices),
          maintenance: this.roundMoney(grossMaintenance),
          totalAdministrativeExpenses: this.roundMoney(
            totalAdministrativeExpenses,
          ),
        },

        taxExpenses: {
          vatToPay: this.roundMoney(vatToPay),
          corporateIncomeTax: this.roundMoney(incomeTax),
          otherTaxes: this.roundMoney(otherTaxes),
          totalTaxExpense: this.roundMoney(totalTaxExpense),
        },

        operationalExpenses: {
          materials: this.roundMoney(grossMaterials),
          equipment: this.roundMoney(grossEquipment),
          transport: this.roundMoney(grossTransport),
          marketing: this.roundMoney(grossMarketing),
          software: this.roundMoney(grossSoftware),
          totalOperationalExpenses: this.roundMoney(totalOperationalExpenses),
        },

        otherExpenses: {
          uncategorized: this.roundMoney(uncategorizedExpenses),
          totalOtherExpenses: this.roundMoney(totalOtherExpenses),
        },
      },

      vat: {
        vatCollectedFromRevenue: this.roundMoney(vatCollected),
        vatDeductibleFromExpenses: this.roundMoney(vatDeductible),
        vatToPay: this.roundMoney(vatToPay),
      },

      corporateResult: {
        netRevenue: this.roundMoney(netRevenue),
        netExpenses: this.roundMoney(netExpenses),
        payrollCost: this.roundMoney(payrollCost),
        operatingProfit: this.roundMoney(operatingProfit),
      },

      finalResult: {
        profitBeforeTax: this.roundMoney(operatingProfit),
        incomeTax: this.roundMoney(incomeTax),
        profitAfterTax: this.roundMoney(profitAfterTax),
      },
    };
  }
}
