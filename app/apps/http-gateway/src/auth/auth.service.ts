import TelegramLoginDto from '@app/contracts/models/dtos/telegramLogin.dto';
import { AUTH_PATTERNS } from '@app/contracts/patterns/authPattern';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as crypto from 'crypto'

@Injectable()
export class AuthService {
    constructor(@Inject(AUTH_PATTERNS.CLIENT) private authClient: ClientProxy) { }

    async login(loginDto: TelegramLoginDto) {
        return await this.authClient.send(AUTH_PATTERNS.LOGIN, loginDto).toPromise()
    }

    async verify(authHeader: string, loginDto: TelegramLoginDto) {
        return await this.authClient.send(AUTH_PATTERNS.VERIFY, { authHeader: authHeader, loginDto: loginDto })
    }
}
