import { Module } from '@nestjs/common';
import { ReportingController } from './reporting.controller';
import { ReportingService } from './reporting.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_PATTERNS } from '@app/contracts/patterns/userPattern';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_PATTERNS.CLIENT,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST ?? 'localhost',
          port: parseInt(process.env.REDIS_PORT ?? '6379'),
        },
      },
    ]),
  ],
  controllers: [ReportingController],
  providers: [ReportingService],
})
export class ReportingModule {}
