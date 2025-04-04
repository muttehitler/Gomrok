import { AUTH_PATTERNS } from '@app/contracts/patterns/authPattern';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule { }
