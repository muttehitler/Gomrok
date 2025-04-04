import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { AUTH_PATTERNS } from '@app/contracts/patterns/authPattern';
import User from './models/concrete/user';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  async login(): Promise<User> {
    return await this.authService.login();
  }
}
