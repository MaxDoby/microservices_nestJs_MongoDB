import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { FinancialController } from './financial.controller';
import { TransactionRepository } from './repositories/transaction.repository';
import { FinancialService } from './financial.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('FINANCIAL_MONGO_URI'),
      }),
    }),
    MongooseModule.forFeature([
      {
        name: Transaction.name,
        schema: TransactionSchema,
      },
    ]),
  ],
  controllers: [FinancialController],
  providers: [FinancialService, TransactionRepository],
})
export class FinancialModule {}
