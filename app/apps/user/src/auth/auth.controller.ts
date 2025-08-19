import { Body, Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { AUTH_PATTERNS } from '@app/contracts/patterns/authPattern';
import User from '../models/concrete/user';
import TelegramLoginDto from '@app/contracts/models/dtos/telegramLogin.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  async login(@Body() loginDto: TelegramLoginDto): Promise<any> {
    return await this.authService.login(loginDto);
  }

  @MessagePattern(AUTH_PATTERNS.VERIFY)
  async verify(data: { authHeader: string, loginDto: TelegramLoginDto }) {
    return await this.authService.verify(data.authHeader, data.loginDto)
  }
}
