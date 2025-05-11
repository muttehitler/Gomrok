import PaymentDataDto from "@app/contracts/models/dtos/payment/paymentDataDto";
import PaymentOptionDto from "@app/contracts/models/dtos/payment/paymentOptionDto";

export default abstract class PaymentBase {
    abstract createInvoice(options: PaymentOptionDto, authorId: string)
    abstract get(id: string, authorId: string)
    abstract verify(data: PaymentDataDto, authorId: string)
}