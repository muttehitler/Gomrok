import mongoose, { MongooseOptions } from "mongoose"
import User from "../../../models/concrete/user"
import * as dotenv from 'dotenv'
import * as bcrypt from 'bcrypt'

dotenv.config();

mongoose.connect(process.env.AUTH_MONGO_STRING ?? ''
    , {
        dbName: process.env.AUTH_MONGO_DB ?? 'authdb'
    }
)
const userSchema = new mongoose.Schema<User>({
    chatId: { type: Number, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    username: { type: String, required: false },
    allowsWriteToPm: { type: Boolean, required: false },
    languageCode: { type: String, required: false },
    photoUrl: { type: String, required: false },
    passwordHash: { type: String, required: true }
})

userSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('passwordHash')) return next();

    let SALT_WORK_FACTOR = 10;

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.passwordHash, salt, function (err, hash) {
            if (err) return next(err);
            user.passwordHash = hash;
            next();
        });
    });
});

let userModel = mongoose.model('users', userSchema)

export { userModel }