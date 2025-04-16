import mongoose, { MongooseOptions } from "mongoose"
import * as dotenv from 'dotenv'
import Panel from "apps/panel/src/models/concrete/panel";

dotenv.config();

mongoose.connect(process.env.AUTH_MONGO_STRING ?? ''
    , {
        dbName: process.env.AUTH_MONGO_DB ?? 'paneldb'
    }
)
const panelSchema = new mongoose.Schema<Panel>({
    username: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    url: { type: String, required: true },
})

let panelModel = mongoose.model('panels', panelSchema)

export { panelModel }