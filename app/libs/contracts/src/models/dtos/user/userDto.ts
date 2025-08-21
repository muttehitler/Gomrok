export default interface UserDto {
    id: string

    chatId: number
    firstName: string
    lastName: string
    username: string
    photoUrl: string
    balance: number

    claims?: string[]
    createdAt?: Date
    updatedAt?: Date

    orderCount?: number
    testLimit?: number
}