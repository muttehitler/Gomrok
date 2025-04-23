import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly claims: string[] | undefined = undefined) { super() }
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        let req = context.switchToHttp().getRequest()
        req.claims = this.claims
        return super.canActivate(context);
    }
}