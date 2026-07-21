import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AddressInfo } from 'node:net';
import { of } from 'rxjs';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthController } from '../../api-gateway/src/app/controllers/auth.controller';
import { FinancialController } from '../../api-gateway/src/app/controllers/financial.controller';
import { AuthGuard } from '../../api-gateway/src/app/guards/auth.guards';
import { ApiGatewayService } from '../../api-gateway/src/app/api-gateway.service';

type ApiGatewayServiceMock = jest.Mocked<
  Pick<
    ApiGatewayService,
    | 'register'
    | 'login'
    | 'validateToken'
    | 'createTransactionForCurrentUser'
    | 'getTransactionsForCurrentUser'
    | 'getFinancialReportForCurrentUser'
    | 'generateFinancialReportPdfForCurrentUser'
    | 'deleteTransactionsForCurrentUser'
  >
>;

type JsonRequestOptions = {
  method: string;
  body?: Record<string, unknown>;
  token?: string;
};

const authUser = {
  id: '6a426f90fcc2f5e584cb060a',
  name: 'Max',
  surname: 'Dobinda',
  email: 'max@max.com',
};

const jwtPayload = {
  sub: authUser.id,
  email: authUser.email,
  type: 'access' as const,
};

const authResponse = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  user: authUser,
};

const transactionResponse = {
  id: '6a426f90fcc2f5e584cb060b',
  userId: authUser.id,
  type: 'income' as const,
  amount: 1500,
  category: 'sales' as const,
  description: 'Website payment',
  date: '2026-07-20',
};

const financialReport = {
  userId: authUser.id,
  period: {
    type: 'annual' as const,
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
};

describe('ApiGateway HTTP API', () => {
  let app: INestApplication;
  let baseUrl: string;
  let apiGatewayService: ApiGatewayServiceMock;

  const requestJson = async <T>(
    path: string,
    options: JsonRequestOptions,
  ): Promise<{ response: Response; body: T }> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.token) {
      headers.Authorization = `Bearer ${options.token}`;
    }

    const response = await fetch(`${baseUrl}${path}`, {
      method: options.method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    return {
      response,
      body: (await response.json()) as T,
    };
  };

  beforeAll(async () => {
    apiGatewayService = {
      register: jest.fn(),
      login: jest.fn(),
      validateToken: jest.fn(),
      createTransactionForCurrentUser: jest.fn(),
      getTransactionsForCurrentUser: jest.fn(),
      getFinancialReportForCurrentUser: jest.fn(),
      generateFinancialReportPdfForCurrentUser: jest.fn(),
      deleteTransactionsForCurrentUser: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController, FinancialController],
      providers: [
        AuthGuard,
        {
          provide: ApiGatewayService,
          useValue: apiGatewayService,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ZodValidationPipe());

    await app.listen(0);

    const address = app.getHttpServer().address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}/api`;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    apiGatewayService.validateToken.mockReturnValue(
      of({
        isValid: true,
        user: jwtPayload,
      }),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers a user through the HTTP API', async () => {
    apiGatewayService.register.mockReturnValue(of(authResponse));

    const { response, body } = await requestJson<typeof authResponse>(
      '/auth/register',
      {
        method: 'POST',
        body: {
          name: 'Max',
          surname: 'Dobinda',
          email: 'max@max.com',
          password: 'password1',
        },
      },
    );

    expect(response.status).toBe(201);
    expect(body).toEqual(authResponse);
  });

  it('logs in a user through the HTTP API', async () => {
    apiGatewayService.login.mockReturnValue(of(authResponse));

    const { response, body } = await requestJson<typeof authResponse>(
      '/auth/login',
      {
        method: 'POST',
        body: {
          email: 'max@max.com',
          password: 'password1',
        },
      },
    );

    expect(response.status).toBe(200);
    expect(body.accessToken).toBe('access-token');
  });

  it('rejects protected endpoints without bearer token', async () => {
    const { response, body } = await requestJson<{
      statusCode: number;
      message: string;
    }>('/transactions', {
      method: 'GET',
    });

    expect(response.status).toBe(400);
    expect(body.message).toBe('Authorization header must be Bearer token.');
  });

  it('creates a transaction for the authenticated user', async () => {
    apiGatewayService.createTransactionForCurrentUser.mockReturnValue(
      of(transactionResponse),
    );

    const requestBody = {
      type: 'income',
      amount: 1500,
      category: 'sales',
      description: 'Website payment',
      date: '2026-07-20',
    };

    const { response, body } = await requestJson<typeof transactionResponse>(
      '/transactions',
      {
        method: 'POST',
        token: 'access-token',
        body: requestBody,
      },
    );

    expect(response.status).toBe(201);
    expect(body).toEqual(transactionResponse);
    expect(apiGatewayService.validateToken).toHaveBeenCalledWith({
      authToken: 'access-token',
    });
    expect(apiGatewayService.createTransactionForCurrentUser).toHaveBeenCalledWith(
      jwtPayload,
      requestBody,
    );
  });

  it('loads paginated transactions for the authenticated user', async () => {
    const paginatedResponse = {
      items: [transactionResponse],
      page: 1,
      limit: 20,
      totalItems: 1,
      totalPages: 1,
    };

    apiGatewayService.getTransactionsForCurrentUser.mockReturnValue(
      of(paginatedResponse),
    );

    const { response, body } = await requestJson<typeof paginatedResponse>(
      '/transactions?page=1&limit=20',
      {
        method: 'GET',
        token: 'access-token',
      },
    );

    expect(response.status).toBe(200);
    expect(body).toEqual(paginatedResponse);
    expect(apiGatewayService.getTransactionsForCurrentUser).toHaveBeenCalledWith(
      jwtPayload,
      {
        page: 1,
        limit: 20,
      },
    );
  });

  it('generates a financial report for the authenticated user', async () => {
    apiGatewayService.getFinancialReportForCurrentUser.mockReturnValue(
      of(financialReport),
    );

    const { response, body } = await requestJson<typeof financialReport>(
      '/transactions/report?period=annual&startDate=2026-01-01&endDate=2026-12-31',
      {
        method: 'GET',
        token: 'access-token',
      },
    );

    expect(response.status).toBe(200);
    expect(body.finalResult.profitAfterTax).toBe(7040);
  });

  it('downloads a financial report PDF for the authenticated user', async () => {
    apiGatewayService.generateFinancialReportPdfForCurrentUser.mockReturnValue(
      of({
        fileName: 'financial-report-6a426f90fcc2f5e584cb060a.pdf',
        mimeType: 'application/pdf',
        contentBase64: Buffer.from('%PDF e2e content').toString('base64'),
      }),
    );

    const response = await fetch(
      `${baseUrl}/transactions/report/pdf?period=annual&startDate=2026-01-01&endDate=2026-12-31`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer access-token',
        },
      },
    );

    const buffer = Buffer.from(await response.arrayBuffer());

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/pdf');
    expect(response.headers.get('content-disposition')).toContain(
      'financial-report-6a426f90fcc2f5e584cb060a.pdf',
    );
    expect(buffer.subarray(0, 4).toString()).toBe('%PDF');
  });

  it('deletes transactions for the authenticated user', async () => {
    const deleteResponse = {
      deletedCount: 2,
    };

    apiGatewayService.deleteTransactionsForCurrentUser.mockReturnValue(
      of(deleteResponse),
    );

    const requestBody = {
      transactionIds: [
        '6a426f90fcc2f5e584cb060b',
        '6a426f90fcc2f5e584cb060c',
      ],
    };

    const { response, body } = await requestJson<typeof deleteResponse>(
      '/transactions',
      {
        method: 'DELETE',
        token: 'access-token',
        body: requestBody,
      },
    );

    expect(response.status).toBe(200);
    expect(body).toEqual(deleteResponse);
    expect(apiGatewayService.deleteTransactionsForCurrentUser).toHaveBeenCalledWith(
      jwtPayload,
      requestBody,
    );
  });
});
