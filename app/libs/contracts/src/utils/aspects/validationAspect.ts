import { ExecutionContext, CallHandler, BadRequestException } from "@nestjs/common";
import { ObjectSchema } from "joi";
import Aspect from "./abstract/aspect";

export default class ValidationAspect extends Aspect {
    constructor(private readonly validator: ObjectSchema<any>) { super() }
    onBefore(context: ExecutionContext, next: CallHandler<any>): void {
        let result = this.validator.validate(context.switchToHttp().getRequest().body)
        if (result.error)
            throw new BadRequestException(result.error.details.map(x => x.message))
    }
    onAfter(context: ExecutionContext, next: CallHandler<any>): void {
    }
    onException(error: any, context: ExecutionContext, next: CallHandler<any>): void {
    }
    onSuccess(context: ExecutionContext, next: CallHandler<any>): void {
    }

}