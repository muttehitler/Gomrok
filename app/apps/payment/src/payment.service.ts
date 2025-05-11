import { Injectable, NotFoundException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import PaymentBase from './paymentServices/abstract/paymentBase';
import PaymentDto from '@app/contracts/models/dtos/payment/paymentDto';
import Payment, { PaymentDocument } from './models/concrete/payment';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PaymentService {
  constructor(private moduleRef: ModuleRef, @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>) { }

  async addPayment({ paymentMethod, paymentOptions }: PaymentDto, authorId: string) {
    const paymentService = await this.moduleRef.resolve<PaymentBase>(paymentMethod)
    const result = await paymentService.createInvoice(paymentOptions, authorId)

    return result;
  }

  async get(id: string, authorId: string) {
    const payment = await this.paymentModel.findById(new Types.ObjectId(id))
    if (!payment)
      throw new NotFoundException()

    const paymentService = await this.moduleRef.resolve<PaymentBase>(payment.paymentMethod)
    const result = await paymentService.get(id, authorId)

    return result
  }

  async verify(payment: PaymentDto, authorId: string) {
    const paymentService = await this.moduleRef.resolve<PaymentBase>(payment.paymentMethod)
    const result = await paymentService.verify(payment.paymentData, authorId)

    return result
  }
}
