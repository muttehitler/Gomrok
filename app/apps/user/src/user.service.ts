import { Injectable } from '@nestjs/common';
import User, { UserDocument } from './models/concrete/user';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import ResultDto from '@app/contracts/models/dtos/resultDto';
import { Messages } from '@app/contracts/messages/messages';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getUserBalance(userId: string): Promise<number> {
    return (await this.userModel.findOne({ _id: new Types.ObjectId(userId) }))?.balance ?? 0
  }

  async updateUserBalance(userId: string, balance: number): Promise<ResultDto> {
    await this.userModel.updateOne({ _id: new Types.ObjectId(userId) }, { $set: { balance: balance } })

    return {
      success: true,
      message: Messages.USER.BALANCE_UPDATED_SUCCESSFULLY.message,
      statusCode: Messages.USER.BALANCE_UPDATED_SUCCESSFULLY.code
    }
  }
}
