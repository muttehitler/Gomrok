import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '@app/contracts/utils/jwt_token/guards/jwt.guard';

@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    @Post()
    @UseGuards(new JwtAuthGuard(['user']))
    async add(@Req() req, @Body() payment) {
        return await this.paymentService.add(payment, req.user['sub'])
    }
}
