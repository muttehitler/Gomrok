import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import User, { UserDocument } from './models/concrete/user';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import ResultDto from '@app/contracts/models/dtos/resultDto';
import { Messages } from '@app/contracts/messages/messages';
import DataResultDto from '@app/contracts/models/dtos/dataResultDto';
import UserDto from '@app/contracts/models/dtos/user/userDto';
import FilterDto from '@app/contracts/models/dtos/filterDto';
import ListDto from '@app/contracts/models/dtos/listDto';
import { ClientProxy } from '@nestjs/microservices';
import { ORDER_PATTERNS } from '@app/contracts/patterns/orderPattern';
import OrderDto from '@app/contracts/models/dtos/order/orderDto';
import { PAYMENT_PATTERNS } from '@app/contracts/patterns/paymentPattern';
import { REPORTING_PATTERNS } from '@app/contracts/patterns/reportingPattern';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(ORDER_PATTERNS.CLIENT) private orderClient: ClientProxy,
    @Inject(PAYMENT_PATTERNS.CLIENT) private paymentClient: ClientProxy,
    @Inject(REPORTING_PATTERNS.CLIENT) private reportingClient: ClientProxy) { }

  async getUserBalance(userId: string): Promise<DataResultDto<number>> {
    return {
      success: true,
      message: Messages.USER.BALANCE_GOT_SUCCESSFULLY.message,
      statusCode: Messages.USER.BALANCE_GOT_SUCCESSFULLY.code,
      data: (await this.userModel.findOne({ _id: new Types.ObjectId(userId) }))?.balance ?? 0
    }
  }

  async updateUserBalance(userId: string, balance: number): Promise<ResultDto> {
    const user = await this.userModel.findOne({ _id: new Types.ObjectId(userId) })

    if (balance < 0)
      throw {
        message: Messages.USER.BALANCE_IS_LOW.message,
        statusCode: Messages.USER.BALANCE_IS_LOW.code
      }

    await this.userModel.updateOne({ _id: new Types.ObjectId(userId) }, { $set: { balance: balance } })

    return {
      success: true,
      message: Messages.USER.BALANCE_UPDATED_SUCCESSFULLY.message,
      statusCode: Messages.USER.BALANCE_UPDATED_SUCCESSFULLY.code
    }
  }

  async get(userId: string): Promise<DataResultDto<UserDto>> {
    let user = (await this.userModel.findOne({ _id: new Types.ObjectId(userId) }))

    if (!user)
      throw new NotFoundException()

    const orders = await this.orderClient.send(ORDER_PATTERNS.MY_ORDERS, { filter: { startIndex: 0, limit: 1, order: 1, payed: true } as FilterDto, userId: String(user._id) }).toPromise() as DataResultDto<ListDto<OrderDto[]>>

    return {
      success: true,
      message: Messages.USER.BALANCE_GOT_SUCCESSFULLY.message,
      statusCode: Messages.USER.BALANCE_GOT_SUCCESSFULLY.code,
      data: {
        id: String(user.id),
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        chatId: user.chatId,
        photoUrl: user.photoUrl,
        balance: user.balance,
        claims: user.claims,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        orderCount: orders.data.length,
        testLimit: user.testLimit ?? 1
      }
    }
  }

  async getList({ startIndex, limit, order }: FilterDto): Promise<DataResultDto<ListDto<UserDto[]>>> {
    const query = this.userModel.find()
    const list = (await query.skip(startIndex).limit(limit).sort({ createdAt: order == 1 ? 1 : -1 })).map<UserDto>(x => {
      return {
        id: String(x._id),
        firstName: x.firstName,
        lastName: x.lastName,
        username: x.username,
        chatId: x.chatId,
        photoUrl: x.photoUrl,
        balance: x.balance,
        claims: x.claims,
        createdAt: x.createdAt,
        updatedAt: x.updatedAt
      }
    })

    return {
      success: true,
      message: Messages.USER.USER_LISTED_SUCCESSFULLY.message,
      statusCode: Messages.USER.USER_LISTED_SUCCESSFULLY.code,
      data: {
        items: list,
        length: (await this.userModel.find()).length
      }
    }
  }

  async increaseBalance(userId: string, amount: number, adminId: string): Promise<ResultDto> {
    const userBalance = await this.getUserBalance(userId);

    const balanceLogResult = await this.paymentClient.send(PAYMENT_PATTERNS.BALANCE_LOG.LOG, {
      type: 'top-up',
      amount: amount,
      admin: adminId,
      user: userId
    }).toPromise() as ResultDto;
    if (!balanceLogResult.success)
      return balanceLogResult;

    const result = await this.updateUserBalance(userId, userBalance.data + amount);

    if (result.success) {
      const admin = await this.getUserForReporting(adminId);
      const user = await this.getUserForReporting(userId);
      this.reportingClient.emit(REPORTING_PATTERNS.ADMIN_INCREASED_BALANCE, {
        admin: admin.data,
        user: user.data,
        amount: amount
      });
    }

    return result;
  }

  async decreaseBalance(userId: string, amount: number, adminId: string): Promise<ResultDto> {
    const userBalance = await this.getUserBalance(userId);

    const balanceLogResult = await this.paymentClient.send(PAYMENT_PATTERNS.BALANCE_LOG.LOG, {
      type: 'reduce',
      amount: amount,
      admin: adminId,
      user: userId
    }).toPromise() as ResultDto;
    if (!balanceLogResult.success)
      return balanceLogResult;

    const result = await this.updateUserBalance(userId, userBalance.data - amount);

    if (result.success) {
      const admin = await this.getUserForReporting(adminId);
      const user = await this.getUserForReporting(userId);
      this.reportingClient.emit(REPORTING_PATTERNS.ADMIN_DECREASED_BALANCE, {
        admin: admin.data,
        user: user.data,
        amount: amount
      });
    }

    return result;
  }

  async getUserForReporting(userId: string): Promise<DataResultDto<UserDto>> {
    const user = await this.userModel.findOne({ _id: new Types.ObjectId(userId) });

    if (!user) {
      throw new NotFoundException();
    }

    return {
      success: true,
      message: Messages.USER.BALANCE_GOT_SUCCESSFULLY.message,
      statusCode: Messages.USER.BALANCE_GOT_SUCCESSFULLY.code,
      data: {
        id: String(user.id),
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        chatId: user.chatId,
        photoUrl: user.photoUrl,
        balance: user.balance,
        claims: user.claims,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        orderCount: 0, // Not needed for reporting
        testLimit: user.testLimit ?? 1,
      },
    };
  }

  async getAdmins(): Promise<DataResultDto<ListDto<UserDto[]>>> {
    const admins = await this.userModel.find({ claims: 'admin' });

    const adminDtos = admins.map<UserDto>(x => {
      return {
        id: String(x._id),
        firstName: x.firstName,
        lastName: x.lastName,
        username: x.username,
        chatId: x.chatId,
        photoUrl: x.photoUrl,
        balance: x.balance,
        claims: x.claims,
        createdAt: x.createdAt,
        updatedAt: x.updatedAt
      }
    });

    return {
      success: true,
      message: Messages.USER.USER_LISTED_SUCCESSFULLY.message,
      statusCode: Messages.USER.USER_LISTED_SUCCESSFULLY.code,
      data: {
        items: adminDtos,
        length: adminDtos.length
      }
    }
  }
}
