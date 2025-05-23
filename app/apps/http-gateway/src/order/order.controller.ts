import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import AddOrderDto from '@app/contracts/models/dtos/order/addOrderDto';
import { JwtAuthGuard } from '@app/contracts/utils/jwt_token/guards/jwt.guard';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) { }

    @Post('buy/:id')
    @UseGuards(new JwtAuthGuard(['user']))
    async buy(@Param('id') id: string, @Req() req) {
        return await this.orderService.buy(id, req.user['sub'])
    }

    @Post()
    @UseGuards(new JwtAuthGuard(['user']))
    async add(@Body() order: AddOrderDto, @Req() req) {
        return await this.orderService.add(order, req.user['sub'])
    }

    @Get(':id')
    @UseGuards(new JwtAuthGuard(['user']))
    async get(@Param('id') id: string, @Req() req) {
        return await this.orderService.get(id, req.user['sub'])
    }
}
