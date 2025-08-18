import { Document } from "mongoose"
import IEntity from '@app/contracts/models/abstract/iEntity'
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import * as bcrypt from 'bcrypt'

@Schema({ timestamps: true })
export default class User extends Document implements IEntity {
    @Prop({ type: Number, required: true })
    chatId: number
    @Prop({ required: true })
    firstName: string
    @Prop()
    lastName: string
    @Prop()
    username: string
    @Prop()
    languageCode: string
    @Prop({ type: Boolean })
    allowsWriteToPm: boolean
    @Prop()
    photoUrl: string
    @Prop()
    passwordHash: string
    @Prop({ type: Number, default: 0 })
    balance: number

    @Prop({ type: [String], default: ['user'] })
    claims: string[]
}

export type UserDocument = User & Document & {
    createdAt: Date;
    updatedAt: Date;
};
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
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