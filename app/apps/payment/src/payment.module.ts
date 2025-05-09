import { Global, Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import Payment, { PaymentSchema } from './models/concrete/payment';
import { PaymentMethod } from './patterns/paymentMethod';
import TRXPayment from './paymentServices/concrete/trxPayment';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.AUTH_MONGO_STRING?.toString() ?? '', { dbName: 'paymentdb' }),
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }])
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
