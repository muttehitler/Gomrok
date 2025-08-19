import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import TelegramLoginDto from '@app/contracts/models/dtos/telegramLogin.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private jwtService: JwtService) { }

    @Post('login')
    login(@Body() loginDto: TelegramLoginDto): any {
        return this.authService.login(loginDto)
    }

    @Get('verify')
    async verify(@Req() req) {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];
        try {
            const decoded = await this.jwtService.verifyAsync(token);
            return { success: true, message: 'successed', data: decoded };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}
