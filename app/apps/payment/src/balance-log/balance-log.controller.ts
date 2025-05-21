import { Controller } from '@nestjs/common';
import { BalanceLogService } from './balance-log.service';
import { MessagePattern } from '@nestjs/microservices';
import { PAYMENT_PATTERNS } from '@app/contracts/patterns/paymentPattern';
import BalanceLogDto from '@app/contracts/models/dtos/payment/balance-log/balanceLogDto';

@Controller('balance-log')
export class BalanceLogController {
    constructor(private balanceLogService: BalanceLogService) { }

    @MessagePattern(PAYMENT_PATTERNS.BALANCE_LOG.LOG)
    async log(balanceLog: BalanceLogDto) {
        return await this.balanceLogService.log(balanceLog)
    }
}
