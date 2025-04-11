import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import TelegramLoginDto from '@app/contracts/models/dtos/telegramLogin.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    login(@Body() loginDto: TelegramLoginDto): any {
        return this.authService.login(loginDto)
    }
}
