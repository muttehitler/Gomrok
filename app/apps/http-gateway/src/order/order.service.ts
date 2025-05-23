import AddOrderDto from '@app/contracts/models/dtos/order/addOrderDto';
import { ORDER_PATTERNS } from '@app/contracts/patterns/orderPattern';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrderService {
    constructor(@Inject(ORDER_PATTERNS.CLIENT) private orderClient: ClientProxy) { }

    async add(order: AddOrderDto, authorId: string) {
        return await this.orderClient.send(ORDER_PATTERNS.ADD, { order: order, authorId: authorId })
    }

    async get(id: string, userId: string) {
        return await this.orderClient.send(ORDER_PATTERNS.GET, { id: id, userId: userId })
    }

    async buy(id: string, userId: string) {
        return await this.orderClient.send(ORDER_PATTERNS.BUY, { id: id, userId: userId })
    }
}
