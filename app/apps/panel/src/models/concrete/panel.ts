import IEntity from "@app/contracts/models/abstract/iEntity";
import { Types } from "mongoose";

export default interface Panel extends IEntity {
    _id?: Types.ObjectId | undefined
    name: string
    username:string
    password:string
    url:string

    __v?: number
}