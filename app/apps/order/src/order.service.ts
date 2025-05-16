import { Injectable } from '@nestjs/common';
import Order, { OrderDocument } from './models/concrete/order';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) { }
}
