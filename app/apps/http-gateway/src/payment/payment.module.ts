import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { BalanceLogService } from './balance-log.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, BalanceLogService]
})
export class PaymentModule { }
