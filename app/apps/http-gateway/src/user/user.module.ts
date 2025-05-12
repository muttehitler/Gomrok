import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_PATTERNS } from '@app/contracts/patterns/userPattern';

@Module({
    controllers: [UserController],
    imports: [
        ClientsModule.register([
            {
                name: USER_PATTERNS.CLIENT,
                transport: Transport.REDIS,
                options: {
                    host: process.env.REDIS_HOST ?? 'localhost',
                    port: parseInt(process.env.REDIS_PORT ?? '6379')
                }
            }
        ])
    ],
    providers: [UserService]
})
export class UserModule { }
