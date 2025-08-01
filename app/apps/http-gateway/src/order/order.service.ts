import FilterDto from '@app/contracts/models/dtos/filterDto';
import AddOrderDto from '@app/contracts/models/dtos/order/addOrderDto';
import RenewOrderDto from '@app/contracts/models/dtos/order/renewOrderDto';
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

    async renew(id: string, renewOptions: RenewOrderDto, userId: string) {
        return await this.orderClient.send(ORDER_PATTERNS.RENEW, { id: id, renewOptions: renewOptions, userId: userId })
    }

    async getList(filter: FilterDto) {
        return await this.orderClient.send(ORDER_PATTERNS.GET_LIST, { filter: filter })
    }

    async myOrders(filter: FilterDto, userId: string) {
        return await this.orderClient.send(ORDER_PATTERNS.MY_ORDERS, { filter: filter, userId: userId })
    }

    async getWithPanelUser(id: string, userId: string) {
        return await this.orderClient.send(ORDER_PATTERNS.GET_WITH_PANEL_USER, { id: id, userId: userId })
    }

    async revokeSub(id: string, userId: string) {
        return await this.orderClient.send(ORDER_PATTERNS.REVOKE_SUB, { id: id, userId: userId })
    }
}
