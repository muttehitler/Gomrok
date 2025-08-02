import { Controller } from '@nestjs/common';
import { BalanceLogService } from './balance-log.service';
import { MessagePattern } from '@nestjs/microservices';
import { PAYMENT_PATTERNS } from '@app/contracts/patterns/paymentPattern';
import BalanceLogDto from '@app/contracts/models/dtos/payment/balance-log/balanceLogDto';
import FilterDto from '@app/contracts/models/dtos/filterDto';

@Controller()
export class BalanceLogController {
    constructor(private balanceLogService: BalanceLogService) { }

    @MessagePattern(PAYMENT_PATTERNS.BALANCE_LOG.LOG)
    async log(balanceLog: BalanceLogDto) {
        return await this.balanceLogService.log(balanceLog)
    }

    @MessagePattern(PAYMENT_PATTERNS.BALANCE_LOG.GET_LIST)
    async getList(data: { filter: FilterDto, userId: string }) {
        return await this.balanceLogService.getList(data.filter, data.userId)
    }
}
