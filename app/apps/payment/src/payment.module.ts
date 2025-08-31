import { Global, Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import Payment, { PaymentSchema } from './models/concrete/payment';
import { PaymentMethod } from './patterns/paymentMethod';
import TRXPayment from './paymentServices/concrete/trxPayment';
import { HttpModule } from '@nestjs/axios';
import { USER_PATTERNS } from '@app/contracts/patterns/userPattern';
import { ClientsModule, Transport } from '@nestjs/microservices';
import BalanceLog, { BalanceLogSchema } from './models/concrete/balanceLogs';
import { BalanceLogModule } from './balance-log/balance-log.module';
import { REPORTING_PATTERNS } from '@app/contracts/patterns/reportingPattern';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_STRING?.toString() ?? '', { dbName: 'paymentdb' }),
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    MongooseModule.forFeature([{ name: BalanceLog.name, schema: BalanceLogSchema }]),
    HttpModule,
    ClientsModule.register([
      {
        name: USER_PATTERNS.CLIENT,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST ?? 'localhost',
          port: parseInt(process.env.REDIS_PORT ?? '6379')
        }
      },
      {
        name: REPORTING_PATTERNS.CLIENT,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST ?? 'localhost',
          port: parseInt(process.env.REDIS_PORT ?? '6379')
        }
      }
    ]),
    BalanceLogModule
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: PaymentMethod.trxWallet,
      useClass: TRXPayment
    }
  ],
})
export class PaymentModule { }
