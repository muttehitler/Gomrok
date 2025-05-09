import PaymentOptionDto from "@app/contracts/models/dtos/payment/paymentOptionDto";
import PaymentBase from "../abstract/paymentBase";
import Payment, { PaymentDocument } from "../../models/concrete/payment";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { PaymentMethod } from "../../patterns/paymentMethod";
import DataResultDto from "@app/contracts/models/dtos/dataResultDto";
import PaymentResultDto from "@app/contracts/models/dtos/payment/paymentResultDto";
import { Messages } from "@app/contracts/messages/messages";
import { NotFoundException } from "@nestjs/common";

export default class TRXPayment implements PaymentBase {
    constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>) { }

    async get(id: string, authorId: string): Promise<DataResultDto<PaymentResultDto>> {
        const payment = await this.paymentModel.findById(new Types.ObjectId(id))
        if (!payment)
            throw new NotFoundException()

        return {
            success: true,
            message: Messages.PAYMENT.INVOICE_GOT.message,
            statusCode: Messages.PAYMENT.INVOICE_GOT.code,
            data: {
                id: String(payment._id),
                walletAddress: payment.walletAddress,
                amount: payment.amount
            }
        }
    }

    async createInvoice({ amount }: PaymentOptionDto, authorId: string): Promise<DataResultDto<PaymentResultDto>> {
        const newpayment = new this.paymentModel({
            status: true,
            completed: false,
            user: new Types.ObjectId(authorId),
            amount: amount,
            currency: 'trx',
            paymentMethod: PaymentMethod.trxWallet,
            walletAddress: process.env.TRX_WALLET
        })
        await newpayment.save()

        return {
            success: true,
            message: Messages.PAYMENT.INVOICE_CREATED_SUCCESSFYLLY.message,
            statusCode: Messages.PAYMENT.INVOICE_CREATED_SUCCESSFYLLY.code,
            data: {
                id: String(newpayment._id),
                walletAddress: process.env.TRX_WALLET?.toString() ?? '',
                amount: amount
            }
        }
    }
}