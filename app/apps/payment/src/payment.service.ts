import { Injectable } from '@nestjs/common';
import Payment, { PaymentDocument } from './models/concrete/payment';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PaymentService {
  constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>) {}

  async addPayment(): Promise<string> {
    const newUser = new this.paymentModel({ status: true, completed: true, userId: 'skdf', price: 3, currency: 'sdlkf', cardNumber: 'sdkf', paymentMethod: 'card to card' })
    await newUser.save()
    return 'successs';
  }
}
