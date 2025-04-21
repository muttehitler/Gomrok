import { CallHandler, ExecutionContext, Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { ClientSession, Connection } from "mongoose";
import { catchError, from, Observable, switchMap, tap } from "rxjs";

@Injectable()
export default class MongooseTransactionInterceptor {
    constructor(
        @InjectConnection() private readonly connection: Connection
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToRpc().getContext()

        return from(this.connection.startSession()).pipe(
            switchMap((session: ClientSession) => {
                session.startTransaction()
                ctx.mongoSession = session

                return next.handle().pipe(
                    tap(async () => {
                        await session.commitTransaction()
                        session.endSession()
                    }),
                    catchError(async (err) => {
                        await session.abortTransaction()
                        session.endSession()
                        throw err
                    })
                );
            })
        );
    }
}