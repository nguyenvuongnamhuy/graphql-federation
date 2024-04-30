/* eslint-disable @typescript-eslint/no-explicit-any */

import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../enum/error-code.enum';
import { GrpcStatus } from '../enum/grpc-status.enum';
import { ApiException } from '../exception/api.exception';

export type GrpcResponseType<U> = { status: number; code: number; message: string; data: U };

export class HttpApiResponse<T> {
  code: ErrorCode;
  message: string;
  data: T;

  constructor(init?: Partial<HttpApiResponse<T>>) {
    Object.assign(this, init);
  }

  public static success<U>(data?: U): HttpApiResponse<U> {
    return new HttpApiResponse<U>({
      code: ErrorCode.SUCCESS,
      message: 'Success',
      data: data,
    });
  }

  public static failed(code: ErrorCode, message: string): HttpApiResponse<any> {
    return new HttpApiResponse<any>({
      code: code,
      message: message,
      data: null,
    });
  }

  public static handle<U, T extends GrpcResponseType<U> = GrpcResponseType<U>>(response?: T): HttpApiResponse<U> {
    if (response.status === GrpcStatus.OK) {
      return this.success(response.data);
    }

    throw new ApiException({
      code: response.code.toString(),
      message: response.message,
      status: this.getHttpStatusFromGrpcStatus(response.status),
    });
  }

  public static getHttpStatusFromGrpcStatus(status: number): number {
    const statusMapping: { [key: number]: number } = {
      [GrpcStatus.CANCELLED]: HttpStatus.BAD_GATEWAY,
      [GrpcStatus.UNKNOWN]: HttpStatus.INTERNAL_SERVER_ERROR,
      [GrpcStatus.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
      [GrpcStatus.DEADLINE_EXCEEDED]: HttpStatus.GATEWAY_TIMEOUT,
      [GrpcStatus.NOT_FOUND]: HttpStatus.NOT_FOUND,
      [GrpcStatus.ALREADY_EXISTS]: HttpStatus.CONFLICT,
      [GrpcStatus.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
      [GrpcStatus.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
      [GrpcStatus.FAILED_PRECONDITION]: HttpStatus.BAD_REQUEST,
      [GrpcStatus.ABORTED]: HttpStatus.CONFLICT,
      [GrpcStatus.OUT_OF_RANGE]: HttpStatus.BAD_REQUEST,
      [GrpcStatus.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
      [GrpcStatus.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
      [GrpcStatus.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
      [GrpcStatus.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    return statusMapping[status] || HttpStatus.INTERNAL_SERVER_ERROR;
  }

  public toString() {
    return JSON.stringify(this);
  }
}
