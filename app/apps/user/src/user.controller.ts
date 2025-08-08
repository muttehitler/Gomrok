import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { USER_PATTERNS } from '@app/contracts/patterns/userPattern';
import DataResultDto from '@app/contracts/models/dtos/dataResultDto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @MessagePattern(USER_PATTERNS.GET_USER_BALANCE)
  async getUserBalance(userId: string): Promise<DataResultDto<number>> {
    return await this.userService.getUserBalance(userId)
  }

  @MessagePattern(USER_PATTERNS.UPDATE_USER_BALANCE)
  async updateUserBalance(data: { userId: string, balance: number }) {
    return await this.userService.updateUserBalance(data.userId, data.balance)
  }

  @MessagePattern(USER_PATTERNS.GET)
  async get(data: { userId: string }) {
    return await this.userService.get(data.userId)
  }
}
