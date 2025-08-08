import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import PaymentBase from './paymentServices/abstract/paymentBase';
import PaymentDto from '@app/contracts/models/dtos/payment/paymentDto';
import Payment, { PaymentDocument } from './models/concrete/payment';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Messages } from '@app/contracts/messages/messages';
import FilterDto from '@app/contracts/models/dtos/filterDto';
import DataResultDto from '@app/contracts/models/dtos/dataResultDto';
import ListDto from '@app/contracts/models/dtos/listDto';
import PaymentItemDto from '@app/contracts/models/dtos/payment/paymentItemDto';
import { ClientProxy } from '@nestjs/microservices';
import { USER_PATTERNS } from '@app/contracts/patterns/userPattern';
import UserDto from '@app/contracts/models/dtos/user/userDto';

@Injectable()
export class PaymentService {
  constructor(private moduleRef: ModuleRef, @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>
    , @Inject(USER_PATTERNS.CLIENT) private userClient: ClientProxy) { }

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

  async getList({ startIndex, limit, order }: FilterDto): Promise<DataResultDto<ListDto<PaymentItemDto[]>>> {
    const query = this.paymentModel.find({ status: true })
    const list = await Promise.all((await query.skip(startIndex).limit(limit).sort({ createdAt: order == 1 ? 1 : -1 })).map<Promise<PaymentItemDto>>(async x => {
      const user = await this.userClient.send(USER_PATTERNS.GET, { userId: String(x.user) }).toPromise() as DataResultDto<UserDto>

      if (!user.success)
        throw new NotFoundException(user.message)

      const userd = user.data

      return {
        id: String(x._id),
        amount: x.amount,
        cardNumber: x.cardNumber,
        completed: x.completed,
        createdAt: x.createdAt,
        currency: x.currency,
        hash: x.hash,
        paymentMethod: x.paymentMethod,
        status: x.status,
        updatedAt: x.updatedAt,
        walletAddress: x.walletAddress,
        user: {
          id: String(x.user),
          firstName: userd.firstName,
          lastName: userd.lastName,
          username: userd.username,
          chatId: userd.chatId,
          photoUrl: userd.photoUrl
        }
      }
    }))

    return {
      success: true,
      message: Messages.PAYMENT.PAYMENT_LISTED_SUCCESSFULLY.message,
      statusCode: Messages.PAYMENT.PAYMENT_LISTED_SUCCESSFULLY.code,
      data: {
        items: list,
        length: (await this.paymentModel.find({ status: true })).length
      }
    }
  }
}
