import IEntity from "@app/contracts/models/abstract/iEntity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";

@Schema({ timestamps: true })
export default class Product extends Document implements IEntity {
    @Prop()
    name: string
    @Prop({ type: Boolean })
    payAsYouGo: boolean
    @Prop({ type: Number })
    usageDuration: number
    @Prop({ type: Number })
    dataLimit: number
    @Prop({ type: Number })
    userLimit: number
    @Prop({ type: Boolean })
    onHold: boolean
    @Prop({ type: Number })
    price: number
    @Prop()
    code: string
    @Prop({ type: Number })
    weight: number
    @Prop({ type: Boolean, default: true })
    status: boolean

    @Prop({ type: Types.ObjectId, ref: 'Panel' })
    panel: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: 'User' })
    author: Types.ObjectId
}


export type ProductDocument = Product & Document
export const ProductSchema = SchemaFactory.createForClass(Product)