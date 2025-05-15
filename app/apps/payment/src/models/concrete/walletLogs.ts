import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";
import Payment from "./payment";
import IEntity from "@app/contracts/models/abstract/iEntity";

@Schema({ timestamps: true })
export default class WalletLog extends Document implements IEntity {
    @Prop({ type: String })
    type: string

    @Prop({ type: Number })
    amount: number

    @Prop({ type: String, required: false })
    orderId: string

    @Prop({ type: Types.ObjectId, ref: 'Payment', required: false })
    payment: Payment
}

export type WalletLogDocument = WalletLog & Document;
export const WalletLogSchema = SchemaFactory.createForClass(WalletLog);