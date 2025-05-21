import { Module } from '@nestjs/common';
import { BalanceLogService } from './balance-log.service';
import { BalanceLogController } from './balance-log.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import BalanceLog, { BalanceLogSchema } from '../models/concrete/balanceLogs';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BalanceLog.name, schema: BalanceLogSchema }])
  ],
  providers: [BalanceLogService],
  controllers: [BalanceLogController]
})
export class BalanceLogModule { }
