import { PAYMENT_PATTERNS } from '@app/contracts/patterns/paymentPattern';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentService {
    constructor(@Inject(PAYMENT_PATTERNS.CLIENT) private paymentClient: ClientProxy) { }

    async add(): Promise<string> {
        return await this.paymentClient.send(PAYMENT_PATTERNS.ADD, {}).toPromise()
    }
}
