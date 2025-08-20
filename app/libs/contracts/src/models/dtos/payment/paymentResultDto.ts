import UserDto from "../user/userDto"

export default interface PaymentResultDto {
    id: string

    status?: boolean
    completed?: boolean
    user?: UserDto
    currency?: string
    cardNumber?: string
    hash?: string

    paymentMethod?: string

    createdAt?: Date;
    updatedAt?: Date;

    walletAddress: string
    amount: number
}