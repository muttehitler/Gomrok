import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import User, { UserSchema } from '../models/concrete/user';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { REPORTING_PATTERNS } from '@app/contracts/patterns/reportingPattern';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ClientsModule.register([
      {
        name: REPORTING_PATTERNS.CLIENT,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST ?? 'localhost',
          port: parseInt(process.env.REDIS_PORT ?? '6379'),
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
