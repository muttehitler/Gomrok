import { Types } from "mongoose"
import IEntity from '@app/contracts/models/abstract/iEntity'

interface User extends IEntity {
    _id: Types.ObjectId | undefined
    name: string
    passwordHash: string
    __v: number
}

export default User