import mongoose, { MongooseOptions } from "mongoose"
import * as dotenv from 'dotenv'
import Payment from "apps/payment/src/models/concrete/payment";

dotenv.config();

mongoose.connect(process.env.AUTH_MONGO_STRING ?? ''
    , {
        dbName: process.env.AUTH_MONGO_DB ?? 'paymentdb'
    }
)
const paymentSchema = new mongoose.Schema<Payment>({
})

let paymentModel = mongoose.model('payments', paymentSchema)

export { paymentModel as panelModel }