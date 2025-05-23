import { Global, Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import Order, { OrderSchema } from './models/concrete/order';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_PATTERNS } from '@app/contracts/patterns/productPattern';
import { USER_PATTERNS } from '@app/contracts/patterns/userPattern';
import { PAYMENT_PATTERNS } from '@app/contracts/patterns/paymentPattern';
import { PANEL_PATTERNS } from '@app/contracts/patterns/panelPattern';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.AUTH_MONGO_STRING?.toString() ?? '', { dbName: 'orderdb' }),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ClientsModule.register([
      {
        name: PRODUCT_PATTERNS.CLIENT,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST ?? 'localhost',
          port: parseInt(process.env.REDIS_PORT ?? '6379')
        }
      }
    ]),
    ClientsModule.register([
      {
        name: USER_PATTERNS.CLIENT,
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
    ClientsModule.register([
      {
        name: PANEL_PATTERNS.CLIENT,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST ?? 'localhost',
          port: parseInt(process.env.REDIS_PORT ?? '6379')
        }
      }
    ])
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule { }
