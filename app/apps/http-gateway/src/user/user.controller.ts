import { JwtAuthGuard } from '@app/contracts/utils/jwt_token/guards/jwt.guard';
import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import FilterDto from '@app/contracts/models/dtos/filterDto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('get_user_balance')
    @UseGuards(new JwtAuthGuard(['user']))
    async add(@Req() req) {
        return await this.userService.getUserBalance(req.user['sub'])
    }

    @Get('/me')
    @UseGuards(new JwtAuthGuard(['user']))
    async me(@Req() req) {
        return await this.userService.get(req.user['sub'])
    }

    @Get()
    @UseGuards(new JwtAuthGuard(['admin']))
    async getList(@Query() filter: FilterDto) {
        return await this.userService.getList(filter)
    }

    @Get(':id')
    @UseGuards(new JwtAuthGuard(['admin']))
    async get(@Param('id') id: string) {
        return await this.userService.get(id)
    }

    @Post('increase_balance/:id')
    @UseGuards(new JwtAuthGuard(['admin']))
    async increaseBalance(@Param('id') id: string, @Body() body, @Req() req) {
        return await this.userService.increaseBalance(id, body.amount, req.user['sub'])
    }

    @Post('decrease_balance/:id')
    @UseGuards(new JwtAuthGuard(['admin']))
    async decreaseBalance(@Param('id') id: string, @Body() body, @Req() req) {
        return await this.userService.decreaseBalance(id, body.amount, req.user['sub'])
    }
}
