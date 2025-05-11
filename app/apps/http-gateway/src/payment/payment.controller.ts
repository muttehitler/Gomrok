import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '@app/contracts/utils/jwt_token/guards/jwt.guard';
import PaymentDto from '@app/contracts/models/dtos/payment/paymentDto';

@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    @Post()
    @UseGuards(new JwtAuthGuard(['user']))
    async add(@Req() req, @Body() payment) {
        return await this.paymentService.add(payment, req.user['sub'])
    }

    @Get(':id')
    @UseGuards(new JwtAuthGuard(['user']))
    async get(@Param('id') id: string, @Req() req) {
        return await this.paymentService.get(id, req.user['sub'])
    }

    @Post('verify')
    @UseGuards(new JwtAuthGuard(['user']))
    async verify(@Body() payment: PaymentDto, @Req() req) {
        return await this.paymentService.verify(payment, req.user['sub'])
    }
}
