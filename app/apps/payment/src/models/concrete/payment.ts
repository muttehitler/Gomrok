import IEntity from "@app/contracts/models/abstract/iEntity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export default class Payment extends Document implements IEntity {
    @Prop()
    status: boolean
    @Prop()
    completed: boolean
    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: Types.ObjectId
    @Prop()
    amount: number
    @Prop()
    currency: string
    @Prop()
    cardNumber: string
    @Prop()
    walletAddress: string

    @Prop()
    paymentMethod: string

}

export type PaymentDocument = Payment & Document;
export const PaymentSchema = SchemaFactory.createForClass(Payment);