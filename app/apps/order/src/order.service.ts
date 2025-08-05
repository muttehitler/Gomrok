import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import Order, { OrderDocument } from './models/concrete/order';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import AddOrderDto from '@app/contracts/models/dtos/order/addOrderDto';
import { ClientProxy } from '@nestjs/microservices';
import ProductDto from '@app/contracts/models/dtos/product/productDto';
import DataResultDto from '@app/contracts/models/dtos/dataResultDto';
import { Messages } from '@app/contracts/messages/messages';
import { PRODUCT_PATTERNS } from '@app/contracts/patterns/productPattern';
import OrderDto from '@app/contracts/models/dtos/order/orderDto';
import { USER_PATTERNS } from '@app/contracts/patterns/userPattern';
import { PAYMENT_PATTERNS } from '@app/contracts/patterns/paymentPattern';
import ResultDto from '@app/contracts/models/dtos/resultDto';
import { PANEL_PATTERNS } from '@app/contracts/patterns/panelPattern';
import PanelAddUserDto from '@app/contracts/models/dtos/panel/panelService/panelAddUserDto';
import FilterDto from '@app/contracts/models/dtos/filterDto';
import ListDto from '@app/contracts/models/dtos/listDto';
import PanelUserDto from '@app/contracts/models/dtos/panel/panelService/panelUserDto';
import PanelModifyUserDto from '@app/contracts/models/dtos/panel/panelService/panelModifyUserDto';
import RenewOrderDto from '@app/contracts/models/dtos/order/renewOrderDto';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @Inject(PRODUCT_PATTERNS.CLIENT) private productClient: ClientProxy,
    @Inject(PAYMENT_PATTERNS.CLIENT) private paymentClient: ClientProxy,
    @Inject(PANEL_PATTERNS.CLIENT) private panelClient: ClientProxy,
    @Inject(USER_PATTERNS.CLIENT) private userClient: ClientProxy) { }

  async add({ name, product }: AddOrderDto, authorId: string): Promise<DataResultDto<string>> {
    const order = new this.orderModel({
      name: name,
      product: new Types.ObjectId(product),
      user: new Types.ObjectId(authorId)
    })

    const productResult = await this.productClient.send(PRODUCT_PATTERNS.GET, product).toPromise() as ProductDto

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

  async buy(id: string, userId: string): Promise<ResultDto> {
    const order = await this.orderModel.findOne({ _id: new Types.ObjectId(id), user: new Types.ObjectId(userId), status: true, payed: false })
    if (!order)
      throw new NotFoundException()

    const userBalance = await this.userClient.send(USER_PATTERNS.GET_USER_BALANCE, userId).toPromise() as DataResultDto<number>

    const updateUserBalanceResult = await this.userClient.send(USER_PATTERNS.UPDATE_USER_BALANCE, { userId: userId, balance: (userBalance.data - order.finalPrice) }).toPromise() as ResultDto

    if (!updateUserBalanceResult.success) {
      throw new InternalServerErrorException("cannot update user balance")
    }

    const balanceLogResult = await this.paymentClient.send(PAYMENT_PATTERNS.BALANCE_LOG.LOG, {
      type: 'reduce',
      amount: order.finalPrice,
      order: String(order._id),
      user: userId
    }).toPromise() as ResultDto
    if (!balanceLogResult.success)
      return balanceLogResult

    order.payed = true

    await order.save()

    const product = await this.productClient.send(PRODUCT_PATTERNS.GET, order.product).toPromise() as ProductDto

    const addUserResult = await this.panelClient.send(PANEL_PATTERNS.PANEL_SERVICE.ADD_USER, {
      user: {
        // activationDeadline: undefined,
        dataLimit: product.dataLimit,
        dataLimitResetStrategy: "no_reset",
        expireStrategy: "start_on_first_use",
        note: "",
        usageDuration: product.usageDuration,
        username: order.name
      } as PanelAddUserDto,
      panel: product.panel
    }).toPromise() as ResultDto

    if (!addUserResult.success)
      return addUserResult

    order.orderCreated = true

    await order.save()

    return {
      success: true,
      message: Messages.ORDER.ORDER_PURCHASED_SUCCESSFULLY.message,
      statusCode: Messages.ORDER.ORDER_PURCHASED_SUCCESSFULLY.code,
    }
  }

  async renew(id: string, renewOptions: RenewOrderDto, userId: string): Promise<ResultDto> {
    const order = await this.orderModel.findOne({ _id: new Types.ObjectId(id), user: new Types.ObjectId(userId), status: true, payed: true })
    if (!order)
      throw new NotFoundException()

    const userBalance = await this.userClient.send(USER_PATTERNS.GET_USER_BALANCE, userId).toPromise() as DataResultDto<number>

    const updateUserBalanceResult = await this.userClient.send(USER_PATTERNS.UPDATE_USER_BALANCE, { userId: userId, balance: (userBalance.data - order.finalPrice) }).toPromise() as ResultDto

    if (!updateUserBalanceResult.success) {
      throw new InternalServerErrorException("cannot update user balance")
    }

    const balanceLogResult = await this.paymentClient.send(PAYMENT_PATTERNS.BALANCE_LOG.LOG, {
      type: 'reduce',
      amount: order.finalPrice,
      order: String(order._id),
      user: userId
    }).toPromise() as ResultDto
    if (!balanceLogResult.success)
      return balanceLogResult

    order.lastRenewal = new Date()
    order.product = new Types.ObjectId(renewOptions?.product ?? order.product)

    await order.save()

    const product = await this.productClient.send(PRODUCT_PATTERNS.GET, order.product).toPromise() as ProductDto

    const modifyUserResult = await this.panelClient.send(PANEL_PATTERNS.PANEL_SERVICE.MODIFY_USER, {
      user: {
        // activationDeadline: undefined,
        dataLimit: product.dataLimit,
        dataLimitResetStrategy: "no_reset",
        expireStrategy: "start_on_first_use",
        note: "",
        usageDuration: product.usageDuration,
        username: order.name
      } as PanelModifyUserDto,
      panel: product.panel
    }).toPromise() as ResultDto

    if (!modifyUserResult.success)
      return modifyUserResult

    if (product.dataLimit != 0) {
      const resetUserResult = await this.panelClient.send(PANEL_PATTERNS.PANEL_SERVICE.RESET, { user: order.name, panel: product.panel }).toPromise() as ResultDto

      if (!modifyUserResult.success)
        return modifyUserResult
    }

    return {
      success: true,
      message: Messages.ORDER.ORDER_RENEWED_SUCCESSFULLY.message,
      statusCode: Messages.ORDER.ORDER_RENEWED_SUCCESSFULLY.code,
    }
  }

  async getList({ startIndex, limit, order }: FilterDto): Promise<DataResultDto<ListDto<OrderDto[]>>> {
    const expression = { status: true }

    const query = this.orderModel.find(expression)
    const list = (await query.skip(startIndex).limit(limit).sort({ createdAt: order == 1 ? 1 : -1 })).map<OrderDto>(x => { return { id: String(x._id), name: x.name, payed: x.payed, product: String(x.product), price: x.price, finalPrice: x.finalPrice } })

    return {
      success: true,
      message: Messages.ORDER.ORDER_LISTED_SUCCESSFULLY.message,
      statusCode: Messages.ORDER.ORDER_LISTED_SUCCESSFULLY.code,
      data: {
        items: list,
        length: (await this.orderModel.find(expression)).length
      }
    }
  }

  async myOrders({ startIndex, limit, order }: FilterDto, userId: string): Promise<DataResultDto<ListDto<OrderDto[]>>> {
    const expression = { status: true, user: new Types.ObjectId(userId) }

    const query = this.orderModel.find(expression)
    const list = (await query.skip(startIndex).limit(limit).sort({ createdAt: order == 1 ? 1 : -1 })).map<OrderDto>(x => { return { id: String(x._id), name: x.name, payed: x.payed, product: String(x.product), price: x.price, finalPrice: x.finalPrice } })

    return {
      success: true,
      message: Messages.ORDER.ORDER_LISTED_SUCCESSFULLY.message,
      statusCode: Messages.ORDER.ORDER_LISTED_SUCCESSFULLY.code,
      data: {
        items: list,
        length: (await this.orderModel.find(expression)).length
      }
    }
  }

  async getWithPanelUser(id: string, userId: string, admin: boolean = false): Promise<DataResultDto<{ order: OrderDto, panelUser: PanelUserDto }>> {
    let query: any = {
      _id: new Types.ObjectId(id),
      status: true,
      payed: true
    }

    if (!admin)
      query.user = new Types.ObjectId(userId)

    const order = await this.orderModel.findOne(query)
    if (!order)
      throw new NotFoundException()

    const product = await this.productClient.send(PRODUCT_PATTERNS.GET, order.product).toPromise() as ProductDto

    const panelUser = await this.panelClient.send(PANEL_PATTERNS.PANEL_SERVICE.GET_USER, { user: order.name, panel: product.panel }).toPromise() as DataResultDto<PanelUserDto>
    if (!panelUser.success)
      throw new NotFoundException(panelUser.message)

    return {
      success: true,
      message: Messages.ORDER.ORDER_GOT_SUCCESSFULLY.message,
      statusCode: Messages.ORDER.ORDER_GOT_SUCCESSFULLY.code,
      data: {
        order: {
          id: String(order._id),
          name: order.name,
          payed: order.payed,
          price: order.price,
          finalPrice: order.finalPrice,
          product: String(order.product)
        },
        panelUser: panelUser.data
      }
    }
  }

  async getWithPanelUserForAdmin(id: string): Promise<DataResultDto<{ order: OrderDto, panelUser: PanelUserDto }>> {
    let query: any = {
      _id: new Types.ObjectId(id),
      status: true,
      payed: true
    }

    const order = await this.orderModel.findOne(query)
    if (!order)
      throw new NotFoundException()

    const product = await this.productClient.send(PRODUCT_PATTERNS.GET, order.product).toPromise() as ProductDto

    const panelUser = await this.panelClient.send(PANEL_PATTERNS.PANEL_SERVICE.GET_USER, { user: order.name, panel: product.panel }).toPromise() as DataResultDto<PanelUserDto>
    if (!panelUser.success)
      throw new NotFoundException(panelUser.message)

    return {
      success: true,
      message: Messages.ORDER.ORDER_GOT_SUCCESSFULLY.message,
      statusCode: Messages.ORDER.ORDER_GOT_SUCCESSFULLY.code,
      data: {
        order: {
          id: String(order._id),
          name: order.name,
          payed: order.payed,
          price: order.price,
          finalPrice: order.finalPrice,
          product: String(order.product)
        },
        panelUser: panelUser.data
      }
    }
  }

  async revokeSubscription(id: string, userId: string): Promise<DataResultDto<PanelUserDto>> {
    const order = await this.orderModel.findOne({ _id: new Types.ObjectId(id), user: new Types.ObjectId(userId), status: true, payed: true })
    if (!order)
      throw new NotFoundException()

    const product = await this.productClient.send(PRODUCT_PATTERNS.GET, order.product).toPromise() as ProductDto

    const revokeSubResult = await this.panelClient.send(PANEL_PATTERNS.PANEL_SERVICE.REVOKE_SUB, { user: order.name, panel: product.panel }).toPromise() as DataResultDto<PanelUserDto>
    if (!revokeSubResult.success)
      throw new NotFoundException(revokeSubResult.message)

    return revokeSubResult
  }
}
