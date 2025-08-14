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
    hash: string

    @Prop()
    paymentMethod: string

    createdAt: Date;
    updatedAt: Date;
}

export type PaymentDocument = Payment & Document;
export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.index(
    { hash: 1 },
    { unique: true, partialFilterExpression: { hash: { $type: "string" } } }
);