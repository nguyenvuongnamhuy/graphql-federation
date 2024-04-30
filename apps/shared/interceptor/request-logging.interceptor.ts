/* eslint-disable  @typescript-eslint/no-explicit-any */
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ClsService } from 'nestjs-cls';
import { serializeRequest, serializeResponse } from '../util/serializers.utils';
import { status } from '@grpc/grpc-js';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger: Logger = new Logger(LoggingInterceptor.name);

  constructor(private readonly cls: ClsService) {}

  public intercept(context: ExecutionContext, call$: CallHandler): Observable<unknown> {
    const requestType = context.getType();
    if (requestType === 'http') {
      this.logRequest(context, requestType);
      return call$.handle().pipe(
        tap({
          next: (val: unknown): void => {
            this.logResponse(val, context, requestType);
          },
          error: (err: Error): void => {
            this.logError(err, context, requestType);
          },
        }),
      );
    }

    if (this.cls.get('requestType') !== 'KAFKA' && requestType === 'rpc') {
      this.logGrpcRequest(context, requestType);
      return call$.handle().pipe(
        tap({
          next: (val: unknown): void => {
            this.logGrpcResponse(val, context, requestType);
          },
          error: (err: Error): void => {
            this.logGrpcError(err, context, requestType);
          },
        }),
      );
    }

    return call$.handle();
  }

  private logGrpcRequest(context: ExecutionContext, protocol: string): void {
    const request = context.switchToRpc().getData();
    this.logger.log({
      message: `[${protocol}] Incoming request - ${context.getClass().name} - ${context.getHandler().name}`,
      request: request,
    });
  }

  private logGrpcResponse(body: any, context: ExecutionContext, protocol: string): void {
    const errorCode: number = body.code;
    const responseStatus: number = body.status;
    if (responseStatus !== status.OK) {
      this.logger.error({
        message: `[${protocol}] Outgoing response - ${responseStatus} - ${context.getClass().name} - ${context.getHandler().name}`,
        body: body.data,
        errorCode: errorCode,
      });
    } else {
      this.logger.log({
        message: `[${protocol}] Outgoing response - ${responseStatus} - ${context.getClass().name} - ${context.getHandler().name}`,
        body: body.data,
        errorCode: errorCode,
      });
    }
  }

  private logGrpcError(error: Error, context: ExecutionContext, protocol: string): void {
    this.logger.error({
      message: `[${protocol}] Outgoing response - Error - ${context.getClass().name} - ${context.getHandler().name}`,
      error: error,
    });
  }

  private logRequest(context: ExecutionContext, protocol: string): void {
    const request = context.switchToHttp().getRequest<Request>();
    this.logger.log({
      message: `[${protocol}] Incoming request - ${request.method} - ${request.url}`,
      request: serializeRequest(request),
    });
  }

  private logResponse(body: any, context: ExecutionContext, protocol: string): void {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const response: Response = context.switchToHttp().getResponse<Response>();
    const meta = {
      response: serializeResponse(response),
      body: body,
    };

    if (response.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error({
        message: `[${protocol}] Outgoing response - ${response.statusCode} - ${request.method} - ${request.url}`,
        ...meta,
      });
    } else if (response.statusCode >= HttpStatus.BAD_REQUEST) {
      this.logger.warn({
        message: `[${protocol}] Outgoing response - ${response.statusCode} - ${request.method} - ${request.url}`,
        ...meta,
      });
    } else {
      this.logger.log({
        message: `[${protocol}] Outgoing response - ${response.statusCode} - ${request.method} - ${request.url}`,
        ...meta,
      });
    }
  }

  private logError(error: unknown, context: ExecutionContext, protocol: string): void {
    const request: Request = context.switchToHttp().getRequest<Request>();

    if (error instanceof HttpException) {
      const statusCode: number = error.getStatus();
      this.logger.error(
        {
          message: `[${protocol}] Outgoing response - ${statusCode} - ${request.method} - ${request.url}`,
          error: error.toString(),
        },
        null,
      );
    } else {
      this.logger.error({
        message: `[${protocol}] Outgoing response - ERROR - ${request.method} - ${request.url}`,
        error: error.toString(),
      });
    }
  }
}
