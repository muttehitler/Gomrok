import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { MessagePattern } from '@nestjs/microservices';
import { ORDER_PATTERNS } from '@app/contracts/patterns/orderPattern';
import AddOrderDto from '@app/contracts/models/dtos/order/addOrderDto';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @MessagePattern(ORDER_PATTERNS.ADD)
  async add(data: { order: AddOrderDto, authorId: string }) {
    return await this.orderService.add(data.order, data.authorId)
  }

  @MessagePattern(ORDER_PATTERNS.GET)
  async get(data: { id: string, userId: string }) {
    return await this.orderService.get(data.id, data.userId)
  }

  @MessagePattern(ORDER_PATTERNS.BUY)
  async buy(data: { id: string, userId: string }) {
    return await this.orderService.buy(data.id, data.userId)
  }
}
