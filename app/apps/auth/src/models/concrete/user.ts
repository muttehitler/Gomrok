import { Types } from "mongoose"
import IEntity from '@app/contracts/models/abstract/iEntity'

interface User extends IEntity {
    _id?: Types.ObjectId | undefined
    chatId: number
    firstName: string
    lastName: string
    username: string
    languageCode: string
    allowsWriteToPm: boolean
    photoUrl: string
    passwordHash: string
    __v?: number
}

export default User