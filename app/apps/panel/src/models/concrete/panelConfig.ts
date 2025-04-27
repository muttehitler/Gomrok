import IEntity from "@app/contracts/models/abstract/iEntity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export default class PanelConfig extends Document implements IEntity {
    @Prop()
    username: string
    @Prop()
    password: string
    @Prop()
    url: string
    @Prop()
    subPrefix: string

    @Prop({ type: Types.ObjectId, ref: 'Panel' })
    panel: Types.ObjectId
}

export type PanelConfigDocument = PanelConfig & Document
export const PanelConfigSchema = SchemaFactory.createForClass(PanelConfig)