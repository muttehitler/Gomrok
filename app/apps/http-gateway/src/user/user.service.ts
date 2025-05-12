import { USER_PATTERNS } from '@app/contracts/patterns/userPattern';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
    constructor(@Inject(USER_PATTERNS.CLIENT) private userClient: ClientProxy) { }

    async getUserBalance(userId: string) {
        return await this.userClient.send(USER_PATTERNS.GET_USER_BALANCE, userId)
    }
}
