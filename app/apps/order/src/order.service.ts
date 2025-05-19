import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import Order, { OrderDocument } from './models/concrete/order';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import AddOrderDto from '@app/contracts/models/dtos/order/addOrderDto';
import { ORDER_PATTERNS } from '@app/contracts/patterns/orderPattern';
import { ClientProxy } from '@nestjs/microservices';
import ProductDto from '@app/contracts/models/dtos/product/productDto';
import DataResultDto from '@app/contracts/models/dtos/dataResultDto';
import { Messages } from '@app/contracts/messages/messages';
import { PRODUCT_PATTERNS } from '@app/contracts/patterns/productPattern';
import OrderDto from '@app/contracts/models/dtos/order/orderDto';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>, @Inject(ORDER_PATTERNS.CLIENT) private orderClient: ClientProxy) { }

  async add({ name, product }: AddOrderDto, authorId: string): Promise<DataResultDto<string>> {
    const order = new this.orderModel({
      name: name,
      product: new Types.ObjectId(product),
      user: new Types.ObjectId(authorId)
    })

    const productResult = await this.orderClient.send(PRODUCT_PATTERNS.GET, product).toPromise() as ProductDto

    order.price = productResult.price
    order.finalPrice = productResult.price

    await order.save()

    return {
      success: true,
      message: Messages.ORDER.ORDER_ADDED_SUCCESSFULLY.message,
      statusCode: Messages.ORDER.ORDER_ADDED_SUCCESSFULLY.code,
      data: String(order._id)
    }
  }

  async get(id: string, userId: string): Promise<DataResultDto<OrderDto>> {
    const order = await this.orderModel.findOne({ _id: new Types.ObjectId(id), user: new Types.ObjectId(userId), status: true })
    if (!order)
      throw new NotFoundException()
    return {
      success: true,
      message: Messages.ORDER.ORDER_FOUND_SUCCESSFULLY.message,
      statusCode: Messages.ORDER.ORDER_FOUND_SUCCESSFULLY.code,
      data: {
        name: order.name,
        payed: order.payed,
        price: order.price,
        finalPrice: order.finalPrice,
        product: String(order.product)
      }
    }
  }
}
