import TelegramLoginDto from '@app/contracts/models/dtos/telegramLogin.dto';
import { AUTH_PATTERNS } from '@app/contracts/patterns/authPattern';
import { ExceptionAspcet } from '@app/contracts/utils/aspects/exceptionAspect';
import { Inject, Injectable, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
    constructor(@Inject(AUTH_PATTERNS.CLIENT) private authClient: ClientProxy) { }

    async login(loginDto: TelegramLoginDto) {
        return await this.authClient.send(AUTH_PATTERNS.LOGIN, loginDto).toPromise()
    }
}
