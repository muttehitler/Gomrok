import { ExecutionContext, CallHandler } from "@nestjs/common";
import Aspect from "./abstract/aspect";

export default class PerformanceAspect extends Aspect {
    startTime: number
    endTime: number
    onBefore(context: ExecutionContext, next: CallHandler<any>): void {
        this.startTime=Date.now()
    }
    onAfter(context: ExecutionContext, next: CallHandler<any>): void {
        this.endTime = Date.now()
        console.log('Request completed in', this.endTime - this.startTime, 'ms');
    }
    onException(error: any, context: ExecutionContext, next: CallHandler<any>): void {
    }
    onSuccess(context: ExecutionContext, next: CallHandler<any>): void {
    }

}