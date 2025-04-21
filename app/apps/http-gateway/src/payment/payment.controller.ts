import { Controller, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    @Get('add')
    async add() {
        return await this.paymentService.add()
    }
}
