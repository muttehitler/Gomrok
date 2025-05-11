import PaymentDataDto from "./paymentDataDto"
import PaymentOptionDto from "./paymentOptionDto"

export default interface PaymentDto {
    id:string
    paymentMethod: string
    paymentOptions: PaymentOptionDto
    paymentData: PaymentDataDto
}