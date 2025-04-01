import { Module } from '@nestjs/common';
import { HttpGatewayController } from './http-gateway.controller';
import { HttpGatewayService } from './http-gateway.service';

@Module({
  imports: [],
  controllers: [HttpGatewayController],
  providers: [HttpGatewayService],
})
export class HttpGatewayModule {}
