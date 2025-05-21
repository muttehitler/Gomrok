import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";
import Payment from "./payment";
import IEntity from "@app/contracts/models/abstract/iEntity";

@Schema({ timestamps: true })
export default class BalanceLog extends Document implements IEntity {
    @Prop({ type: String })
    type: string

    @Prop({ type: Number })
    amount: number

    @Prop({ type: Types.ObjectId, ref: 'Order', required: false })
    order: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: 'Payment', required: false })
    payment: Payment

    @Prop({ type: Types.ObjectId, ref: 'User', required: false })
    user: Types.ObjectId
}

export type BalanceLogDocument = BalanceLog & Document;
export const BalanceLogSchema = SchemaFactory.createForClass(BalanceLog);