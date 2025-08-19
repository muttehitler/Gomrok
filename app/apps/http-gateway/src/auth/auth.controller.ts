import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import TelegramLoginDto from '@app/contracts/models/dtos/telegramLogin.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    login(@Body() loginDto: TelegramLoginDto): any {
        return this.authService.login(loginDto)
    }

    @Post('verify')
    async verify(@Req() req, @Body() loginDto: TelegramLoginDto) {
        return this.authService.verify(req.headers['authorization'], loginDto)
    }
}
