import {
  CreateAuditLogRequest,
  DeleteTransactionsResponse,
  FinancialReportResponse,
  JwtPayload,
  TransactionResponse,
} from '@financial-tracker/contracts';
import { DeleteTransactionsDto } from '../dto/delete-transactions.dto';

export const buildCreateTransactionAuditLog = (
  user: JwtPayload,
  transaction: TransactionResponse,
): CreateAuditLogRequest => ({
  actorUserId: user.sub,
  actorEmail: user.email,
  action: 'CREATE_TRANSACTION',
  resourceType: 'transaction',
  resourceId: transaction.id,
  status: 'success',
  metadata: {
    type: transaction.type,
    amount: transaction.amount,
    category: transaction.category,
  },
});

export const buildDeleteTransactionsAuditLog = (
  user: JwtPayload,
  body: DeleteTransactionsDto,
  deleteResult: DeleteTransactionsResponse,
): CreateAuditLogRequest => ({
  actorUserId: user.sub,
  actorEmail: user.email,
  action: 'DELETE_TRANSACTIONS',
  resourceType: 'transaction',
  status: 'success',
  metadata: {
    transactionIds: body.transactionIds,
    deletedCount: deleteResult.deletedCount,
  },
});

export const buildGenerateReportAuditLog = (
  user: JwtPayload,
  report: FinancialReportResponse,
): CreateAuditLogRequest => ({
  actorUserId: user.sub,
  actorEmail: user.email,
  action: 'GENERATE_REPORT',
  resourceType: 'financial-report',
  status: 'success',
  metadata: {
    period: report.period,
    profitAfterTax: report.finalResult.profitAfterTax,
  },
});
