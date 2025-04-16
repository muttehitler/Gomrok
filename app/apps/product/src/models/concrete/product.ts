import IEntity from "@app/contracts/models/abstract/iEntity";
import { Types } from "mongoose";

export default interface Product extends IEntity {
    _id: Types.ObjectId | undefined,
    name: string
    payAsYouGo: boolean
    usageDuration: number
    dataLimit: number
    userLimit: number
    onHold: boolean
}