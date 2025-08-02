import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import AddOrderDto from '@app/contracts/models/dtos/order/addOrderDto';
import { JwtAuthGuard } from '@app/contracts/utils/jwt_token/guards/jwt.guard';
import FilterDto from '@app/contracts/models/dtos/filterDto';
import RenewOrderDto from '@app/contracts/models/dtos/order/renewOrderDto';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) { }

    @Post('renew/:id')
    @UseGuards(new JwtAuthGuard(['user']))
    async renew(@Param('id') id: string, @Body() renewOptions: RenewOrderDto, @Req() req) {
        return await this.orderService.renew(id, renewOptions, req.user['sub'])
    }

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

    @Get('get_list')
    @UseGuards(new JwtAuthGuard(['admin']))
    async getList(@Query() filter: FilterDto){
        return await this.orderService.getList(filter)
    }

    @Get('my_orders')
    @UseGuards(new JwtAuthGuard(['user']))
    async myOrders(@Query() filter: FilterDto, @Req() req) {
        return await this.orderService.myOrders(filter, req.user['sub'])
    }

    @Get('get_with_panel_user/:id')
    @UseGuards(new JwtAuthGuard(['user']))
    async getWithPanelUser(@Param('id') id: string, @Req() req) {
        return await this.orderService.getWithPanelUser(id, req.user['sub'])
    }

    @Get('get_with_panel_user/admin/:id')
    @UseGuards(new JwtAuthGuard(['user']))
    async getWithPanelUserForAdmin(@Param('id') id: string) {
        return await this.orderService.getWithPanelUserForAdmin(id)
    }

    @Post(':id/revoke_sub')
    @UseGuards(new JwtAuthGuard(['user']))
    async revokeSub(@Param('id') id: string, @Req() req) {
        return await this.orderService.revokeSub(id, req.user['sub'])
    }

    @Get(':id')
    @UseGuards(new JwtAuthGuard(['user']))
    async get(@Param('id') id: string, @Req() req) {
        return await this.orderService.get(id, req.user['sub'])
    }
}
