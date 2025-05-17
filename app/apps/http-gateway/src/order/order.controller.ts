import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import AddOrderDto from '@app/contracts/models/dtos/order/addOrderDto';
import { JwtAuthGuard } from '@app/contracts/utils/jwt_token/guards/jwt.guard';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) { }

    @Post()
    @UseGuards(new JwtAuthGuard(['user']))
    async add(@Body() order: AddOrderDto, @Req() req) {
        return await this.orderService.add(order, req.user['sub'])
    }
}
