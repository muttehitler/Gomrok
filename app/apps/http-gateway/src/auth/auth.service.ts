import { AUTH_PATTERNS } from '@app/contracts/patterns/authPattern';
import { ExceptionAspcet } from '@app/contracts/utils/aspects/exceptionAspect';
import { Inject, Injectable, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
    constructor(@Inject(AUTH_PATTERNS.CLIENT) private authClient: ClientProxy) { }

    async login() {
        return await this.authClient.send(AUTH_PATTERNS.LOGIN, {}).toPromise()
    }
}
