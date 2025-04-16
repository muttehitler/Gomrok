import mongoose, { MongooseOptions } from "mongoose"
import * as dotenv from 'dotenv'
import product from "apps/product/src/models/concrete/product";

dotenv.config();

mongoose.connect(process.env.AUTH_MONGO_STRING ?? ''
    , {
        dbName: process.env.AUTH_MONGO_DB ?? 'productdb'
    }
)
const productSchema = new mongoose.Schema<product>({
    name: { type: String, required: true },
    payAsYouGo: { type: Boolean, required: true },
    usageDuration: { type: Number, required: true },
    dataLimit: { type: Number, required: true },
    userLimit: { type: Number, required: true },
    onHold: { type: Boolean, required: true },
})

let productModel = mongoose.model('products', productSchema)

export { productModel }