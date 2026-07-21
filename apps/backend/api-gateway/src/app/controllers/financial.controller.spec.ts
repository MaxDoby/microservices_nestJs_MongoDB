import { of } from 'rxjs';
import { FinancialController } from './financial.controller';
import type { ApiGatewayService } from '../api-gateway.service';
import type { PdfHttpResponse } from '../types/http-response.types';

describe('FinancialController', () => {
  const user = {
    sub: '6a426f90fcc2f5e584cb060a',
    email: 'max@max.com',
    type: 'access' as const,
  };

  const apiGatewayService = {
    createTransactionForCurrentUser: jest.fn(),
    getFinancialReportForCurrentUser: jest.fn(),
    generateFinancialReportPdfForCurrentUser: jest.fn(),
    getTransactionsForCurrentUser: jest.fn(),
    deleteTransactionsForCurrentUser: jest.fn(),
  };

  let controller: FinancialController;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new FinancialController(
      apiGatewayService as unknown as ApiGatewayService,
    );
  });

  it('delegates create transaction request to api gateway service', () => {
    const body = {
      type: 'income' as const,
      amount: 1500,
      category: 'sales',
      date: '2026-07-20',
    };

    apiGatewayService.createTransactionForCurrentUser.mockReturnValue(of({ id: 'tx-id' }));

    expect(controller.createTransaction(user, body)).toBe(
      apiGatewayService.createTransactionForCurrentUser.mock.results[0].value,
    );
    expect(apiGatewayService.createTransactionForCurrentUser).toHaveBeenCalledWith(
      user,
      body,
    );
  });

  it('delegates report request to api gateway service', () => {
    const query = {
      period: 'annual' as const,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
    };

    apiGatewayService.getFinancialReportForCurrentUser.mockReturnValue(
      of({ userId: user.sub }),
    );

    expect(controller.getFinancialReport(user, query)).toBe(
      apiGatewayService.getFinancialReportForCurrentUser.mock.results[0].value,
    );
    expect(apiGatewayService.getFinancialReportForCurrentUser).toHaveBeenCalledWith(
      user,
      query,
    );
  });

  it('sends generated PDF through the HTTP response', (done) => {
    const query = {
      period: 'annual' as const,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
    };
    const response: PdfHttpResponse = {
      setHeader: jest.fn(),
      send: jest.fn(),
    };

    apiGatewayService.generateFinancialReportPdfForCurrentUser.mockReturnValue(
      of({
        fileName: 'financial-report.pdf',
        mimeType: 'application/pdf',
        contentBase64: Buffer.from('%PDF').toString('base64'),
      }),
    );

    controller.getFinancialReportPdf(user, query, response).subscribe({
      complete: () => {
        expect(response.setHeader).toHaveBeenCalledWith(
          'Content-Type',
          'application/pdf',
        );
        expect(response.setHeader).toHaveBeenCalledWith(
          'Content-Disposition',
          'attachment; filename="financial-report.pdf"',
        );
        expect(response.send).toHaveBeenCalledWith(Buffer.from('%PDF'));
        done();
      },
    });
  });

  it('delegates paginated transactions request to api gateway service', () => {
    const query = {
      page: 1,
      limit: 20,
    };

    apiGatewayService.getTransactionsForCurrentUser.mockReturnValue(of({ items: [] }));

    expect(controller.getTransactions(user, query)).toBe(
      apiGatewayService.getTransactionsForCurrentUser.mock.results[0].value,
    );
    expect(apiGatewayService.getTransactionsForCurrentUser).toHaveBeenCalledWith(
      user,
      query,
    );
  });

  it('delegates delete transactions request to api gateway service', () => {
    const body = {
      transactionIds: ['6a426f90fcc2f5e584cb060b'],
    };

    apiGatewayService.deleteTransactionsForCurrentUser.mockReturnValue(
      of({ deletedCount: 1 }),
    );

    expect(controller.deleteTransactions(user, body)).toBe(
      apiGatewayService.deleteTransactionsForCurrentUser.mock.results[0].value,
    );
    expect(apiGatewayService.deleteTransactionsForCurrentUser).toHaveBeenCalledWith(
      user,
      body,
    );
  });
});
