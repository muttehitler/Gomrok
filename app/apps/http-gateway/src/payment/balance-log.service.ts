import FilterDto from '@app/contracts/models/dtos/filterDto';
import { PAYMENT_PATTERNS } from '@app/contracts/patterns/paymentPattern';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class BalanceLogService {
    constructor(@Inject(PAYMENT_PATTERNS.CLIENT) private paymentClient: ClientProxy) { }

    async getList(filter: FilterDto, userId: string) {
        return await this.paymentClient.send(PAYMENT_PATTERNS.BALANCE_LOG.GET_LIST, { filter: filter, userId: userId })
    }
}
