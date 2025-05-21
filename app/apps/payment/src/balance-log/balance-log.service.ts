import { Injectable } from '@nestjs/common';
import BalanceLog, { BalanceLogDocument } from '../models/concrete/balanceLogs';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import ResultDto from '@app/contracts/models/dtos/resultDto';
import BalanceLogDto from '@app/contracts/models/dtos/payment/balance-log/balanceLogDto';
import { Messages } from '@app/contracts/messages/messages';

@Injectable()
export class BalanceLogService {
    constructor(@InjectModel(BalanceLog.name) private balanceLogModel: Model<BalanceLogDocument>) { }

    async log(balanceLog: BalanceLogDto): Promise<ResultDto> {
        const balanceLogToAdd = new this.balanceLogModel({
            type: balanceLog.type,
            amount: balanceLog.amount,
            order: new Types.ObjectId(balanceLog.order),
            payment: new Types.ObjectId(balanceLog.payment),
            user: new Types.ObjectId(balanceLog.user)
        })
        await balanceLogToAdd.save()

        return {
            success: true,
            message: Messages.PAYMENT.BALANCE_LOG.BALANCE_LOGGED_SUCCESSFULLY.message,
            statusCode: Messages.PAYMENT.BALANCE_LOG.BALANCE_LOGGED_SUCCESSFULLY.code
        }
    }
}
