import PaymentOptionDto from "@app/contracts/models/dtos/payment/paymentOptionDto";

export default abstract class PaymentBase {
    abstract createInvoice(options: PaymentOptionDto, authorId: string)
    abstract get(id: string, authorId: string)
}