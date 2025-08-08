import UserDto from "../user/userDto"

export default interface PaymentItemDto {
    id: string

    status: boolean
    completed: boolean
    user: UserDto
    amount: number
    currency: string
    cardNumber: string
    walletAddress: string
    hash: string

    paymentMethod: string

    createdAt: Date;
    updatedAt: Date;
}