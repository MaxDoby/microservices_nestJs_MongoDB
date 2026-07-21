import { BadRequestException, HttpException } from '@nestjs/common';
import {
  AUDIT_PATTERNS,
  AUTH_PATTERNS,
  FINANCIAL_PATTERNS,
  JwtPayload,
  PDF_PATTERNS,
} from '@financial-tracker/contracts';
import { of, throwError } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { ApiGatewayService } from './api-gateway.service';

const buildClient = () => ({
  send: jest.fn(),
});

type AuthAction = 'CREATE_TRANSACTION' | 'DELETE_TRANSACTIONS' | 'GENERATE_REPORT';

const buildAuthResponse = () => ({
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  user: {
    id: '6a426f90fcc2f5e584cb060a',
    name: 'Max',
    surname: 'Dobinda',
    email: 'max@max.com',
  },
});

const buildTransactionResponse = () => ({
  id: '6a426f90fcc2f5e584cb060b',
  userId: '6a426f90fcc2f5e584cb060a',
  type: 'income',
  amount: 1500,
  category: 'sales',
  description: 'Website payment',
  date: '2026-07-20',
});

const buildAuditLogResponse = (
  action: AuthAction,
) => ({
  id: '6a426f90fcc2f5e584cb060c',
  actorUserId: '6a426f90fcc2f5e584cb060a',
  actorEmail: 'max@max.com',
  action,
  resourceType: action === 'GENERATE_REPORT' ? 'financial-report' : 'transaction',
  resourceId:
    action === 'CREATE_TRANSACTION' ? '6a426f90fcc2f5e584cb060b' : undefined,
  status: 'success',
  createdAt: '2026-07-20T00:00:00.000Z',
});

const buildFinancialReport = () => ({
  userId: '6a426f90fcc2f5e584cb060a',
  period: {
    type: 'annual',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
  },
  generatedAt: '2026-07-20T00:00:00.000Z',
  revenue: {
    grossRevenue: 12000,
    netRevenue: 10000,
    vatCollected: 2000,
  },
  expenses: {
    grossExpenses: 2400,
    netExpenses: 2000,
    vatDeductible: 400,
    payrollExpenses: {
      grossSalaries: 0,
      netSalaries: 0,
      pensionFund: 0,
      medicalFund: 0,
      socialInsuranceFund: 0,
      totalPayrollTaxes: 0,
      totalPayrollCost: 0,
    },
    socialContributionExpenses: {
      pensionFund: 0,
      medicalFund: 0,
      socialInsuranceFund: 0,
      otherContributions: 0,
      totalSocialContributions: 0,
    },
    administrativeExpenses: {
      rent: 0,
      utilities: 0,
      leasing: 0,
      office: 0,
      services: 2400,
      maintenance: 0,
      totalAdministrativeExpenses: 2400,
    },
    taxExpenses: {
      vatToPay: 1600,
      corporateIncomeTax: 960,
      otherTaxes: 0,
      totalTaxExpense: 2560,
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
    vatCollectedFromRevenue: 2000,
    vatDeductibleFromExpenses: 400,
    vatToPay: 1600,
  },
  corporateResult: {
    netRevenue: 10000,
    netExpenses: 2000,
    payrollCost: 0,
    operatingProfit: 8000,
  },
  finalResult: {
    profitBeforeTax: 8000,
    incomeTax: 960,
    profitAfterTax: 7040,
  },
});

const buildPdfResponse = () => ({
  fileName: 'financial-report-6a426f90fcc2f5e584cb060a.pdf',
  mimeType: 'application/pdf',
  contentBase64: 'JVBERi0xLjMK',
});

describe('ApiGatewayService', () => {
  const authClient = buildClient();
  const financialClient = buildClient();
  const pdfClient = buildClient();
  const auditClient = buildClient();

  let service: ApiGatewayService;

  const user: JwtPayload = {
    sub: '6a426f90fcc2f5e584cb060a',
    email: 'max@max.com',
    type: 'access',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new ApiGatewayService(
      authClient as never,
      financialClient as never,
      pdfClient as never,
      auditClient as never,
    );
  });

  it('sends register payload to auth microservice', async () => {
    const payload = {
      name: 'Max',
      surname: 'Dobinda',
      email: 'max@max.com',
      password: 'password1',
    };

    authClient.send.mockReturnValue(of(buildAuthResponse()));

    const result = await lastValueFrom(service.register(payload));

    expect(authClient.send).toHaveBeenCalledWith(
      AUTH_PATTERNS.REGISTER,
      payload,
    );
    expect(result.accessToken).toBe('access-token');
  });

  it('converts rpc errors to http exceptions', async () => {
    authClient.send.mockReturnValue(
      throwError(() => ({
        statusCode: 409,
        message: 'User with this email already exists.',
      })),
    );

    await expect(
      lastValueFrom(
        service.register({
          name: 'Max',
          surname: 'Dobinda',
          email: 'max@max.com',
          password: 'password1',
        }),
      ),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('converts rpc errors without status and message to internal server error', async () => {
    authClient.send.mockReturnValue(throwError(() => ({})));

    await expect(
      lastValueFrom(
        service.login({
          email: 'max@max.com',
          password: 'password1',
        }),
      ),
    ).rejects.toMatchObject({
      message: 'Internal server error',
      status: 500,
    });
  });

  it('sends login payload to auth microservice', async () => {
    const payload = {
      email: 'max@max.com',
      password: 'password1',
    };

    authClient.send.mockReturnValue(of(buildAuthResponse()));

    const result = await lastValueFrom(service.login(payload));

    expect(authClient.send).toHaveBeenCalledWith(AUTH_PATTERNS.LOGIN, payload);
    expect(result.refreshToken).toBe('refresh-token');
  });

  it('sends refresh token payload to auth microservice', async () => {
    const payload = {
      refreshToken: 'refresh-token',
    };

    authClient.send.mockReturnValue(of(buildAuthResponse()));

    const result = await lastValueFrom(service.refreshToken(payload));

    expect(authClient.send).toHaveBeenCalledWith(
      AUTH_PATTERNS.REFRESH_TOKEN,
      payload,
    );
    expect(result.accessToken).toBe('access-token');
  });

  it('converts refresh token rpc errors to http exceptions', async () => {
    authClient.send.mockReturnValue(
      throwError(() => ({
        statusCode: 401,
        message: 'Invalid or expired refresh token.',
      })),
    );

    await expect(
      lastValueFrom(
        service.refreshToken({
          refreshToken: 'expired-refresh-token',
        }),
      ),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('sends logout payload to auth microservice', async () => {
    const payload = {
      refreshToken: 'refresh-token',
    };

    authClient.send.mockReturnValue(of({ success: true }));

    const result = await lastValueFrom(service.logout(payload));

    expect(authClient.send).toHaveBeenCalledWith(AUTH_PATTERNS.LOGOUT, payload);
    expect(result).toEqual({ success: true });
  });

  it('converts logout rpc errors to http exceptions', async () => {
    authClient.send.mockReturnValue(
      throwError(() => ({
        statusCode: 401,
        message: 'Invalid or expired refresh token.',
      })),
    );

    await expect(
      lastValueFrom(
        service.logout({
          refreshToken: 'expired-refresh-token',
        }),
      ),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('sends validate token payload to auth microservice', async () => {
    const payload = {
      authToken: 'access-token',
    };

    authClient.send.mockReturnValue(
      of({
        isValid: true,
        user,
      }),
    );

    const result = await lastValueFrom(service.validateToken(payload));

    expect(authClient.send).toHaveBeenCalledWith(
      AUTH_PATTERNS.VALIDATE_TOKEN,
      payload,
    );
    expect(result.user).toEqual(user);
  });

  it('converts validate token rpc errors to http exceptions', async () => {
    authClient.send.mockReturnValue(
      throwError(() => ({
        statusCode: 401,
        message: 'Invalid or expired token.',
      })),
    );

    await expect(
      lastValueFrom(
        service.validateToken({
          authToken: 'expired-token',
        }),
      ),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('creates transaction for current user and writes audit log', async () => {
    financialClient.send.mockReturnValue(of(buildTransactionResponse()));
    auditClient.send.mockReturnValue(of(buildAuditLogResponse('CREATE_TRANSACTION')));

    const result = await lastValueFrom(
      service.createTransactionForCurrentUser(user, {
        type: 'income',
        amount: 1500,
        category: 'sales',
        description: 'Website payment',
        date: '2026-07-20',
      }),
    );

    expect(financialClient.send).toHaveBeenCalledWith(
      FINANCIAL_PATTERNS.CREATE_TRANSACTION,
      {
        userId: '6a426f90fcc2f5e584cb060a',
        type: 'income',
        amount: 1500,
        category: 'sales',
        description: 'Website payment',
        date: '2026-07-20',
      },
    );
    expect(auditClient.send).toHaveBeenCalledWith(AUDIT_PATTERNS.CREATE_LOG, {
      actorUserId: '6a426f90fcc2f5e584cb060a',
      actorEmail: 'max@max.com',
      action: 'CREATE_TRANSACTION',
      resourceType: 'transaction',
      resourceId: '6a426f90fcc2f5e584cb060b',
      status: 'success',
      metadata: {
        type: 'income',
        amount: 1500,
        category: 'sales',
      },
    });
    expect(result.id).toBe('6a426f90fcc2f5e584cb060b');
  });

  it('converts create transaction rpc errors to http exceptions', async () => {
    financialClient.send.mockReturnValue(
      throwError(() => ({
        statusCode: 400,
        message: 'Invalid income category.',
      })),
    );

    await expect(
      lastValueFrom(
        service.createTransaction({
          userId: user.sub,
          type: 'income',
          amount: 1500,
          category: 'sales',
          date: '2026-07-20',
        }),
      ),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('rejects financial report when startDate is after endDate', () => {
    expect(() =>
      service.getFinancialReportForCurrentUser(user, {
        period: 'annual',
        startDate: '2026-12-31',
        endDate: '2026-01-01',
      }),
    ).toThrow(BadRequestException);

    expect(financialClient.send).not.toHaveBeenCalled();
  });

  it('gets transactions using pagination query', async () => {
    const paginatedResponse = {
      items: [buildTransactionResponse()],
      page: 2,
      limit: 10,
      totalItems: 11,
      totalPages: 2,
    };

    financialClient.send.mockReturnValue(of(paginatedResponse));

    const result = await lastValueFrom(
      service.getTransactionsForCurrentUser(user, {
        page: 2,
        limit: 10,
      }),
    );

    expect(financialClient.send).toHaveBeenCalledWith(
      FINANCIAL_PATTERNS.GET_TRANSACTIONS,
      {
        page: 2,
        limit: 10,
      },
    );
    expect(result).toEqual(paginatedResponse);
  });

  it('converts get transactions rpc errors to http exceptions', async () => {
    financialClient.send.mockReturnValue(
      throwError(() => ({
        statusCode: 500,
        message: 'Could not load transactions.',
      })),
    );

    await expect(
      lastValueFrom(
        service.getTransactions({
          page: 1,
          limit: 20,
        }),
      ),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('sends direct get financial report payload to financial microservice', async () => {
    const payload = {
      userId: user.sub,
      period: {
        type: 'annual' as const,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
      },
    };

    financialClient.send.mockReturnValue(of(buildFinancialReport()));

    const result = await lastValueFrom(service.getFinancialReport(payload));

    expect(financialClient.send).toHaveBeenCalledWith(
      FINANCIAL_PATTERNS.GET_REPORT,
      payload,
    );
    expect(result.userId).toBe(user.sub);
  });

  it('converts get financial report rpc errors to http exceptions', async () => {
    financialClient.send.mockReturnValue(
      throwError(() => ({
        statusCode: 500,
        message: 'Could not generate report.',
      })),
    );

    await expect(
      lastValueFrom(
        service.getFinancialReport({
          userId: user.sub,
          period: {
            type: 'annual',
            startDate: '2026-01-01',
            endDate: '2026-12-31',
          },
        }),
      ),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('sends direct PDF payload to PDF microservice', async () => {
    const report = buildFinancialReport();
    const payload = {
      userId: user.sub,
      report,
    };

    pdfClient.send.mockReturnValue(of(buildPdfResponse()));

    const result = await lastValueFrom(service.generateFinancialReportPdf(payload));

    expect(pdfClient.send).toHaveBeenCalledWith(
      PDF_PATTERNS.GENERATE_FINANCIAL_REPORT,
      payload,
    );
    expect(result.fileName).toBe('financial-report-6a426f90fcc2f5e584cb060a.pdf');
  });

  it('converts PDF rpc errors to http exceptions', async () => {
    pdfClient.send.mockReturnValue(
      throwError(() => ({
        statusCode: 500,
        message: 'Could not generate PDF.',
      })),
    );

    await expect(
      lastValueFrom(
        service.generateFinancialReportPdf({
          userId: user.sub,
          report: buildFinancialReport(),
        }),
      ),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('deletes transactions for current user and writes audit log', async () => {
    financialClient.send.mockReturnValue(
      of({
        deletedCount: 2,
      }),
    );

    auditClient.send.mockReturnValue(of(buildAuditLogResponse('DELETE_TRANSACTIONS')));

    const result = await lastValueFrom(
      service.deleteTransactionsForCurrentUser(user, {
        transactionIds: [
          '6a426f90fcc2f5e584cb060b',
          '6a426f90fcc2f5e584cb060c',
        ],
      }),
    );

    expect(financialClient.send).toHaveBeenCalledWith(
      FINANCIAL_PATTERNS.DELETE_TRANSACTIONS,
      {
        transactionIds: [
          '6a426f90fcc2f5e584cb060b',
          '6a426f90fcc2f5e584cb060c',
        ],
      },
    );
    expect(auditClient.send).toHaveBeenCalledWith(AUDIT_PATTERNS.CREATE_LOG, {
      actorUserId: '6a426f90fcc2f5e584cb060a',
      actorEmail: 'max@max.com',
      action: 'DELETE_TRANSACTIONS',
      resourceType: 'transaction',
      status: 'success',
      metadata: {
        transactionIds: [
          '6a426f90fcc2f5e584cb060b',
          '6a426f90fcc2f5e584cb060c',
        ],
        deletedCount: 2,
      },
    });
    expect(result).toEqual({ deletedCount: 2 });
  });

  it('converts delete transactions rpc errors to http exceptions', async () => {
    financialClient.send.mockReturnValue(
      throwError(() => ({
        statusCode: 500,
        message: 'Could not delete transactions.',
      })),
    );

    await expect(
      lastValueFrom(
        service.deleteTransactions({
          transactionIds: ['6a426f90fcc2f5e584cb060b'],
        }),
      ),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('gets financial report for current user and writes audit log', async () => {
    financialClient.send.mockReturnValue(of(buildFinancialReport()));
    auditClient.send.mockReturnValue(of(buildAuditLogResponse('GENERATE_REPORT')));

    const result = await lastValueFrom(
      service.getFinancialReportForCurrentUser(user, {
        period: 'annual',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
      }),
    );

    expect(financialClient.send).toHaveBeenCalledWith(
      FINANCIAL_PATTERNS.GET_REPORT,
      {
        userId: '6a426f90fcc2f5e584cb060a',
        period: {
          type: 'annual',
          startDate: '2026-01-01',
          endDate: '2026-12-31',
        },
      },
    );
    expect(auditClient.send).toHaveBeenCalledWith(AUDIT_PATTERNS.CREATE_LOG, {
      actorUserId: '6a426f90fcc2f5e584cb060a',
      actorEmail: 'max@max.com',
      action: 'GENERATE_REPORT',
      resourceType: 'financial-report',
      status: 'success',
      metadata: {
        period: {
          type: 'annual',
          startDate: '2026-01-01',
          endDate: '2026-12-31',
        },
        profitAfterTax: 7040,
      },
    });
    expect(result.finalResult.profitAfterTax).toBe(7040);
  });

  it('generates financial report PDF from report data', async () => {
    const report = buildFinancialReport();

    financialClient.send.mockReturnValue(of(report));
    auditClient.send.mockReturnValue(of(buildAuditLogResponse('GENERATE_REPORT')));
    pdfClient.send.mockReturnValue(of(buildPdfResponse()));

    const result = await lastValueFrom(
      service.generateFinancialReportPdfForCurrentUser(user, {
        period: 'annual',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
      }),
    );

    expect(pdfClient.send).toHaveBeenCalledWith(
      PDF_PATTERNS.GENERATE_FINANCIAL_REPORT,
      {
        userId: '6a426f90fcc2f5e584cb060a',
        report,
      },
    );
    expect(result.mimeType).toBe('application/pdf');
  });

  it('converts audit rpc errors to http exceptions', async () => {
    auditClient.send.mockReturnValue(
      throwError(() => ({
        statusCode: 500,
        message: 'Could not create audit log.',
      })),
    );

    await expect(
      lastValueFrom(
        service.createAuditLog({
          actorUserId: user.sub,
          actorEmail: user.email,
          action: 'GENERATE_REPORT',
          resourceType: 'financial-report',
          status: 'success',
        }),
      ),
    ).rejects.toBeInstanceOf(HttpException);
  });
});
