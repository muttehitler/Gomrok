import { Controller, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern } from '@nestjs/microservices';
import { PAYMENT_PATTERNS } from '@app/contracts/patterns/paymentPattern';
import PaymentDto from '@app/contracts/models/dtos/payment/paymentDto';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @MessagePattern(PAYMENT_PATTERNS.ADD)
  async addPayment(data: { payment: PaymentDto, authorId: string }) {
    return await this.paymentService.addPayment(data.payment, data.authorId);
  }

  @MessagePattern(PAYMENT_PATTERNS.GET)
  async get(data: { id: string, authorId: string }) {
    return await this.paymentService.get(data.id, data.authorId)
  }

  @MessagePattern(PAYMENT_PATTERNS.VERIFY)
  async verify(data: { payment: PaymentDto, authorId: string }) {
    return await this.paymentService.verify(data.payment, data.authorId)
  }
}
