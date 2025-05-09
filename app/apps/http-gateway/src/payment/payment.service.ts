import PaymentDto from '@app/contracts/models/dtos/payment/paymentDto';
import { PAYMENT_PATTERNS } from '@app/contracts/patterns/paymentPattern';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentService {
    constructor(@Inject(PAYMENT_PATTERNS.CLIENT) private paymentClient: ClientProxy) { }

    async add(payment: PaymentDto, authorId: string) {
        return await this.paymentClient.send(PAYMENT_PATTERNS.ADD, { payment: payment, authorId: authorId })
    }

    async get(id: string, authorId: string) {
        return await this.paymentClient.send(PAYMENT_PATTERNS.GET, { id: id, authorId: authorId })
    }
}
