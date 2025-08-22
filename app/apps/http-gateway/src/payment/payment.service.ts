import FilterDto from '@app/contracts/models/dtos/filterDto';
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

    async get(id: string) {
        return await this.paymentClient.send(PAYMENT_PATTERNS.GET, { id: id })
    }

    async getForUser(id: string, authorId: string) {
        return await this.paymentClient.send(PAYMENT_PATTERNS.GET_FOR_USER, { id: id, authorId: authorId })
    }

    async verify(payment: PaymentDto, authorId: string) {
        return await this.paymentClient.send(PAYMENT_PATTERNS.VERIFY, { payment: payment, authorId: authorId })
    }

    async getList(filter: FilterDto) {
        return await this.paymentClient.send(PAYMENT_PATTERNS.GET_LIST, { filter: filter })
    }
}
