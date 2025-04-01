import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import PassportUser from "src/models/dtos/passportUser";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'abc123',
            passReqToCallback: true
        })
    }

    async validate(req: any, payload: PassportUser) {
        if (!req.claims)
            return payload
        if (req.claims?.filter(x => payload.claims.includes(x)).length <= 0)
            throw UnauthorizedException
        return payload;
    }
}