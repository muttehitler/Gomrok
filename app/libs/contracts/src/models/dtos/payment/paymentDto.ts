import PaymentOptionDto from "./paymentOptionDto"

export default interface PaymentDto {
    paymentMethod: string
    paymentOptions: PaymentOptionDto
}