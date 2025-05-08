import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import PaymentBase from './paymentServices/abstract/paymentBase';
import PaymentDto from '@app/contracts/models/dtos/payment/paymentDto';

@Injectable()
export class PaymentService {
  constructor(private moduleRef: ModuleRef) { }

  async addPayment({ paymentMethod, paymentOptions }: PaymentDto, authorId: string) {
    const paymentService = await this.moduleRef.resolve<PaymentBase>(paymentMethod)
    const result = await paymentService.createInvoice(paymentOptions, authorId)

    return result;
  }
}
