import { ExecutionContext, CallHandler } from "@nestjs/common";
import Aspect from "./abstract/aspect";

export class ExceptionAspcet extends Aspect {
    onBefore(context: ExecutionContext, next: CallHandler<any>): void {
    }
    onAfter(context: ExecutionContext, next: CallHandler<any>): void {
    }
    onException(error: any, context: ExecutionContext, next: CallHandler<any>): void {
        console.log('(execption aspect)on exception: ' + JSON.stringify(error))
    }
    onSuccess(context: ExecutionContext, next: CallHandler<any>): void {
    }

}