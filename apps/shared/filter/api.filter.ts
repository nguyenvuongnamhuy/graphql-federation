import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiException } from '../exception/api.exception';
import { GrpcMapping } from './grpc/grpc-status-mapping.exception';
import { GrpcException } from './grpc/grpc.exception';
import { Environment } from '../enum/common.enum';
import { ErrorCode } from '../enum/error-code.enum';
import { ValidateException } from '../exception/validate.exception';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { InternalException } from '../exception/internal.exception';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  constructor(private config: ConfigService) {}

  catch(exception: ApiException | HttpException | GrpcException | InternalException | ValidateException | unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof ApiException) {
      response.status(exception.getStatus()).send(exception.toJSON());
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      return response.status(status).send({
        status,
        code: `ERR-${status}`,
        message: (<{ message: string }>res).message || res || exception.message,
        stack: !(Object.values([Environment.Staging, Environment.Production]) as string[]).includes(this.config.get('NODE_ENV') as string)
          ? exception.stack
          : undefined,
      });
    }

    if (exception instanceof GrpcException || (exception as GrpcException).metadata) {
      const grpcException = exception as GrpcException;
      const httpStatus = GrpcMapping.convertGrpcToHttpStatus(grpcException.code);
      const metadata = grpcException.metadata;
      const errorCode = (metadata?.get('error-code')[0] as string) || 'ERR-500';
      const message = (metadata?.get('message')[0] as string) || grpcException.message;

      return response.status(httpStatus).send(
        new ApiException({
          status: httpStatus,
          code: errorCode,
          message: message,
          stack: !(Object.values([Environment.Staging, Environment.Production]) as string[]).includes(this.config.get('NODE_ENV') as string)
            ? (<Error>grpcException).stack
            : undefined,
        }),
      );
    }

    if (exception instanceof InternalException) {
      return this.httpThrowException(ctx, exception.code, HttpStatus.INTERNAL_SERVER_ERROR, exception);
    }

    if (exception instanceof ValidateException) {
      return this.httpThrowException(ctx, exception.code, HttpStatus.BAD_REQUEST, exception);
    }

    // handle general error
    return this.httpThrowException(ctx, ErrorCode.UNKNOWN.toString(), HttpStatus.INTERNAL_SERVER_ERROR, exception as Error);
  }

  httpThrowException(ctx: HttpArgumentsHost, errorCode: string, httpStatus: number, exception: Error): void {
    const response = ctx.getResponse();

    return response.status(httpStatus).send({
      code: errorCode,
      message: exception.message,
      stack: !(Object.values([Environment.Staging, Environment.Production]) as string[]).includes(this.config.get('NODE_ENV') as string)
        ? exception.stack
        : undefined,
    });
  }
}
