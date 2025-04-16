import { NestFactory } from '@nestjs/core';
import { ProductModule } from './product.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { AllExceptionsFilter } from '@app/contracts/utils/crossCuttingConcerns/exception/rcpExceptionFilter';
import PerformanceAspect from '@app/contracts/utils/aspects/performanceAspect';
import { ExceptionAspcet } from '@app/contracts/utils/aspects/exceptionAspect';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ProductModule, {
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST ?? 'localhosts',
      port: parseInt(process.env.REDIS_PORT ?? '63792')
    }
  });

  app.useGlobalInterceptors(new ExceptionAspcet())
  app.useGlobalInterceptors(new PerformanceAspect())

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen();
}
bootstrap();
