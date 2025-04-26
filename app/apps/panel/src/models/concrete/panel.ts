import IEntity from "@app/contracts/models/abstract/iEntity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export default class Panel extends Document implements IEntity {
    @Prop()
    name: string
    @Prop()
    type: string
}

export type PanelDocument = Panel & Document
export const PanelSchema = SchemaFactory.createForClass(Panel)