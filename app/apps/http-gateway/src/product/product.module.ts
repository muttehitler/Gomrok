import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_PATTERNS } from '@app/contracts/patterns/productPattern';

@Module({
  controllers: [ProductController],
  imports: [
    ClientsModule.register([
      {
        name: PRODUCT_PATTERNS.CLIENT,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST ?? 'localhost',
          port: parseInt(process.env.REDIS_PORT ?? '6379')
        }
      }
    ])
  ],
  providers: [ProductService]
})
export class ProductModule { }
