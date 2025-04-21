import { Global, Module } from '@nestjs/common';
import { HttpGatewayController } from './http-gateway.controller';
import { HttpGatewayService } from './http-gateway.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_PATTERNS } from '@app/contracts/patterns/authPattern';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from './payment/payment.module';
import { PAYMENT_PATTERNS } from '@app/contracts/patterns/paymentPattern';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: AUTH_PATTERNS.CLIENT,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST ?? 'localhost',
          port: parseInt(process.env.REDIS_PORT ?? '6379')
        }
      }
    ]),
    ClientsModule.register([
      {
        name: PAYMENT_PATTERNS.CLIENT,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST ?? 'localhost',
          port: parseInt(process.env.REDIS_PORT ?? '6379')
        }
      }
    ]),
    AuthModule,
    PaymentModule
  ],
  controllers: [HttpGatewayController],
  providers: [HttpGatewayService],
  exports: [ClientsModule]
})
export class HttpGatewayModule { }
