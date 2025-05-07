import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '@app/contracts/utils/jwt_token/guards/jwt.guard';

@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    @Get('add')
    @UseGuards(new JwtAuthGuard(['user']))
    async add(@Req() req) {
        console.log(req.user['claims'])
        return await this.paymentService.add()
    }
}
