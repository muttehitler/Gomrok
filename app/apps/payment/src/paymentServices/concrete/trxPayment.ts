import PaymentOptionDto from "@app/contracts/models/dtos/payment/paymentOptionDto";
import PaymentBase from "../abstract/paymentBase";
import Payment, { PaymentDocument } from "../../models/concrete/payment";
import mongoose, { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { PaymentMethod } from "../../patterns/paymentMethod";
import DataResultDto from "@app/contracts/models/dtos/dataResultDto";
import PaymentResultDto from "@app/contracts/models/dtos/payment/paymentResultDto";
import { Messages } from "@app/contracts/messages/messages";
import { ForbiddenException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import PaymentDataDto from "@app/contracts/models/dtos/payment/paymentDataDto";
import ResultDto from "@app/contracts/models/dtos/resultDto";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { USER_PATTERNS } from "@app/contracts/patterns/userPattern";
import { ClientProxy } from "@nestjs/microservices";
import BalanceLog, { BalanceLogDocument } from "../../models/concrete/balanceLogs";
import UserDto from "@app/contracts/models/dtos/user/userDto";

@Injectable()
export default class TRXPayment implements PaymentBase {
    constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
        @InjectModel(BalanceLog.name) private balanceLogModel: Model<BalanceLogDocument>,
        private httpService: HttpService,
        @Inject(USER_PATTERNS.CLIENT) private userClient: ClientProxy) { }

    async verify(data: PaymentDataDto, authorId: string): Promise<ResultDto> {
        let result: ResultDto = { success: false, message: '', statusCode: 0 }
        const session = await this.paymentModel.startSession()
        try {
            await session.withTransaction(async () => {
                if (await this.paymentModel.findOne({ hash: data.hash })) {
                    result = {
                        success: true,
                        message: Messages.PAYMENT.HASH_USED.message,
                        statusCode: Messages.PAYMENT.HASH_USED.code
                    }
                    return
                }
                const userPayment = await this.paymentModel.findOne({ user: new Types.ObjectId(authorId) }).sort({ createdAt: -1 })

                if (!userPayment || userPayment.completed || !userPayment.status) {
                    result = {
                        success: false,
                        message: Messages.PAYMENT.PAYMENT_DOESNT_EXIST.message,
                        statusCode: Messages.PAYMENT.PAYMENT_DOESNT_EXIST.code
                    }
                    return
                }

                const headers = {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                };

                const response = await firstValueFrom(this.httpService.get("https://apilist.tronscanapi.com/api/transaction-info?hash=" + data.hash, { headers, validateStatus: () => true }))

                if (response.data.toAddress != userPayment?.walletAddress) {
                    result = {
                        success: false,
                        message: Messages.PAYMENT.WALLET_ADDRESS_INVALID.message,
                        statusCode: Messages.PAYMENT.WALLET_ADDRESS_INVALID.code
                    }
                    return
                }
                if (response.data.contractRet != 'SUCCESS') {
                    result = {
                        success: false,
                        message: Messages.PAYMENT.TRANSACTION_ISNT_COMPLETED.message,
                        statusCode: Messages.PAYMENT.TRANSACTION_ISNT_COMPLETED.code
                    }
                    return
                }

                const trxAmount = response.data.contractData.amount / 1000000

                if (userPayment.createdAt > new Date(response.data.timestamp / 1000)) {
                    result = {
                        success: false,
                        message: Messages.PAYMENT.HASH_ISNT_YOURS.message,
                        statusCode: Messages.PAYMENT.HASH_ISNT_YOURS.code
                    }
                    return
                }

                if ((userPayment.amount - 0.5) > trxAmount || (userPayment.amount + 0.5) < trxAmount) {
                    result = {
                        success: false,
                        message: Messages.PAYMENT.HASH_ISNT_YOURS.message,
                        statusCode: Messages.PAYMENT.HASH_ISNT_YOURS.code
                    }
                    return
                }

                const tronRateResponse = await firstValueFrom(this.httpService.get(process.env.RATE_ADDRESS!, { headers, validateStatus: () => true }))

                const usdtRate = tronRateResponse.data.fiats[0].price
                const trxRate = tronRateResponse.data.coins[0].price * usdtRate

                const rialPrice = Math.round(trxAmount * trxRate)

                const userBalance = await this.userClient.send(USER_PATTERNS.GET_USER_BALANCE, authorId).toPromise() as DataResultDto<number>

                const updateUserBalanceResult = await this.userClient.send(USER_PATTERNS.UPDATE_USER_BALANCE, { userId: authorId, balance: (userBalance.data + rialPrice) }).toPromise() as ResultDto

                if (!updateUserBalanceResult.success) {
                    result = {
                        success: false,
                        message: Messages.PAYMENT.CANNOT_INCREASE_BALANCE.message,
                        statusCode: Messages.PAYMENT.CANNOT_INCREASE_BALANCE.code
                    }
                    throw new InternalServerErrorException()
                }

                const balanceLog = new this.balanceLogModel({
                    type: 'increase',
                    amount: rialPrice,
                    payment: userPayment._id
                })
                await balanceLog.save()

                userPayment.completed = true
                userPayment.hash = data.hash

                await userPayment.save()

                result = {
                    success: true,
                    message: Messages.PAYMENT.INVOICE_VERIFIED.message,
                    statusCode: Messages.PAYMENT.INVOICE_VERIFIED.code
                }
                return
            })
        } catch (error) {
            throw error
        } finally {
            session.endSession()
        }

        return result
    }

    async get(id: string, authorId: string): Promise<DataResultDto<PaymentResultDto>> {
        const payment = await this.paymentModel.findById(new Types.ObjectId(id))
        if (!payment)
            throw new NotFoundException()
        if (String(payment.user) != authorId)
            throw new ForbiddenException()

        const user = await this.userClient.send(USER_PATTERNS.GET, { userId: String(payment.user) }).toPromise() as DataResultDto<UserDto>

        return {
            success: true,
            message: Messages.PAYMENT.INVOICE_GOT.message,
            statusCode: Messages.PAYMENT.INVOICE_GOT.code,
            data: {
                id: String(payment._id),
                walletAddress: payment.walletAddress,
                amount: payment.amount,
                cardNumber: payment.cardNumber,
                completed: payment.completed,
                createdAt: payment.createdAt,
                currency: payment.currency,
                hash: payment.hash,
                paymentMethod: payment.paymentMethod,
                status: payment.status,
                updatedAt: payment.updatedAt,
                user: {
                    id: String(user.data.id),
                    firstName: user.data.firstName,
                    lastName: user.data.lastName,
                    username: user.data.username,
                    chatId: user.data.chatId,
                    photoUrl: user.data.photoUrl
                }
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