import IEntity from "@app/contracts/models/abstract/iEntity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export default class Panel extends Document implements IEntity {
    @Prop()
    name: string
    @Prop()
    type: string
    @Prop({ type: Number })
    weight: number
    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: Types.ObjectId
    @Prop({ type: Boolean, default: true })
    status: boolean

    @Prop()
    username: string
    @Prop()
    password: string
    @Prop()
    url: string
    @Prop()
    subPrefix: string
}

export type PanelDocument = Panel & Document
export const PanelSchema = SchemaFactory.createForClass(Panel)