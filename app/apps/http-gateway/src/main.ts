import { NestFactory } from '@nestjs/core';
import { HttpGatewayModule } from './http-gateway.module';
import { EExceptionFilter } from '@app/contracts/utils/crossCuttingConcerns/exception/rcpE';
import { ExceptionAspcet } from '@app/contracts/utils/aspects/exceptionAspect';
import { ThrowExceptionAspcet } from '@app/contracts/utils/aspects/throwExceptionAspect';

async function bootstrap() {
  const app = await NestFactory.create(HttpGatewayModule);

  app.useGlobalInterceptors(new ThrowExceptionAspcet())
  
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
