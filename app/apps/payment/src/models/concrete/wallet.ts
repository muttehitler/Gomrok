import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export default class Wallet {
    @Prop({ type: Types.ObjectId })
    userId: Types.ObjectId

    @Prop({ type: Number })
    amount: number
}