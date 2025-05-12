import { JwtAuthGuard } from '@app/contracts/utils/jwt_token/guards/jwt.guard';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('get_user_balance')
    @UseGuards(new JwtAuthGuard(['user']))
    async add(@Req() req) {
        return await this.userService.getUserBalance(req.user['sub'])
    }
}
