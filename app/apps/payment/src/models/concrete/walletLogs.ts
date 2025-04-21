import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import Payment from "./payment";

@Schema()
export default class WalletLogs {
    @Prop({ type: String })
    type: string

    @Prop({ type: Number })
    amount: number

    @Prop({ type: String ,required:false})
    orderId: string

    @Prop({ type: Types.ObjectId, ref: 'Payment' ,required:false})
    payment: Payment
}