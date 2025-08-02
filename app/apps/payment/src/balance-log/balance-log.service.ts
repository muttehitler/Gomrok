import { Injectable } from '@nestjs/common';
import BalanceLog, { BalanceLogDocument } from '../models/concrete/balanceLogs';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import ResultDto from '@app/contracts/models/dtos/resultDto';
import BalanceLogDto from '@app/contracts/models/dtos/payment/balance-log/balanceLogDto';
import { Messages } from '@app/contracts/messages/messages';
import ListDto from '@app/contracts/models/dtos/listDto';
import DataResultDto from '@app/contracts/models/dtos/dataResultDto';
import FilterDto from '@app/contracts/models/dtos/filterDto';

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

    async getList({ startIndex, limit, order }: FilterDto, userId: string): Promise<DataResultDto<ListDto<BalanceLogDto[]>>> {
        const expression = { user: new Types.ObjectId(userId), status: true }

        const query = this.balanceLogModel.find(expression)
        const list = (await query.skip(startIndex).limit(limit).sort({ createdAt: order == 1 ? 1 : -1 })).map<BalanceLogDto>(x => {
            return { id: String(x._id), type: x.type, amount: x.amount, order: String(x.order), payment: String(x.payment), user: String(x.user) }
        })

        return {
            success: true,
            message: Messages.ORDER.ORDER_LISTED_SUCCESSFULLY.message,
            statusCode: Messages.ORDER.ORDER_LISTED_SUCCESSFULLY.code,
            data: {
                items: list,
                length: (await this.balanceLogModel.find(expression)).length
            }
        }
    }
}
