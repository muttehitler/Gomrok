import { CallHandler, ExecutionContext, HttpException, HttpStatus, NestInterceptor } from "@nestjs/common"
import { catchError, EMPTY, Observable, tap, finalize } from "rxjs"

abstract class Aspect implements NestInterceptor {
    httpException: HttpException
    constructor() {

    }
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        this.onBefore(context, next)
        let isSuccess = true
        return next.handle().pipe(
            tap(() => {
                if (isSuccess)
                    this.onSuccess(context, next)
            }),
            catchError((err) => {
                isSuccess = false
                this.onException(err, context, next)
                throw err;
            }),
            finalize(() => {
                this.onAfter(context, next)
            })
        )
    }
    abstract onBefore(context: ExecutionContext, next: CallHandler<any>): void;
    abstract onAfter(context: ExecutionContext, next: CallHandler<any>): void;
    abstract onException(error: any, context: ExecutionContext, next: CallHandler<any>): void;
    abstract onSuccess(context: ExecutionContext, next: CallHandler<any>): void;
}

export default Aspect