import IEntity from "@app/contracts/models/abstract/iEntity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export default class Order extends Document implements IEntity {
    @Prop()
    name: string
    @Prop()
    identifier: string
    @Prop({ type: Boolean, default: false })
    payed: boolean
    @Prop({ type: Boolean, default: true })
    status: boolean
    @Prop({ type: Boolean, default: false })
    orderCreated: boolean
    @Prop({ type: Number })
    price: number
    @Prop({ type: Number })
    finalPrice: number
    @Prop({ type: Date })
    lastRenewal: Date
    @Prop({ type: Boolean, default: false })
    test: boolean

    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: 'Product' })
    product: Types.ObjectId
}

export type OrderDocument = Order & Document
export const OrderSchema = SchemaFactory.createForClass(Order)