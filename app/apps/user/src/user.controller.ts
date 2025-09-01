import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { USER_PATTERNS } from '@app/contracts/patterns/userPattern';
import DataResultDto from '@app/contracts/models/dtos/dataResultDto';
import FilterDto from '@app/contracts/models/dtos/filterDto';

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

  @MessagePattern(USER_PATTERNS.GET_LIST)
  async getList(data: { filter: FilterDto }) {
    return await this.userService.getList(data.filter)
  }

  @MessagePattern(USER_PATTERNS.INCREASE_BALANCE)
  async increaseBalance(data: { userId: string, amount: number, adminId: string }) {
    return await this.userService.increaseBalance(data.userId, data.amount, data.adminId)
  }

  @MessagePattern(USER_PATTERNS.DECREASE_BALANCE)
  async decreaseBalance(data: { userId: string, amount: number, adminId: string }) {
    return await this.userService.decreaseBalance(data.userId, data.amount, data.adminId)
  }

  @MessagePattern(USER_PATTERNS.GET_ADMINS)
  async getAdmins() {
    return await this.userService.getAdmins();
  }
}
