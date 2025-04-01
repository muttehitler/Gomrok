import { NestFactory } from '@nestjs/core';
import { HttpGatewayModule } from './http-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(HttpGatewayModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
