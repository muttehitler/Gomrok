import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToRpc();

    console.error('Exception caught in filter:', exception);

    throw new RpcException({
      message: exception.message || 'Internal server error',
      code: exception.status || 500,
    });
  }
}