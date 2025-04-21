import { Controller, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern } from '@nestjs/microservices';
import { PAYMENT_PATTERNS } from '@app/contracts/patterns/paymentPattern';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @MessagePattern(PAYMENT_PATTERNS.ADD)
  async addPayment(): Promise<string> {
    return await this.paymentService.addPayment();
  }
}
