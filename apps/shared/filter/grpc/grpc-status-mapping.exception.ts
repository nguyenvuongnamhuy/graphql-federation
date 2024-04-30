import { HttpStatus } from '@nestjs/common';
import { GrpcStatus } from '../../enum/grpc-status.enum';

export class GrpcMapping {
  static convertHttpToGrpcStatus(httpStatus: HttpStatus): GrpcStatus {
    switch (httpStatus) {
      case HttpStatus.OK:
        return GrpcStatus.OK;
      case HttpStatus.NOT_FOUND:
        return GrpcStatus.NOT_FOUND;
      case HttpStatus.UNAUTHORIZED:
        return GrpcStatus.UNAUTHENTICATED;
      case HttpStatus.FORBIDDEN:
        return GrpcStatus.PERMISSION_DENIED;
      case HttpStatus.BAD_REQUEST:
        return GrpcStatus.INVALID_ARGUMENT;
      case HttpStatus.SERVICE_UNAVAILABLE:
        return GrpcStatus.UNAVAILABLE;
      case HttpStatus.NOT_ACCEPTABLE:
        return GrpcStatus.ALREADY_EXISTS;
      default:
        return GrpcStatus.UNKNOWN;
    }
  }

  static convertGrpcToHttpStatus(grpcStatus: GrpcStatus): HttpStatus {
    switch (grpcStatus) {
      case GrpcStatus.OK:
        return HttpStatus.OK;
      case GrpcStatus.NOT_FOUND:
        return HttpStatus.NOT_FOUND;
      case GrpcStatus.UNAUTHENTICATED:
        return HttpStatus.UNAUTHORIZED;
      case GrpcStatus.PERMISSION_DENIED:
        return HttpStatus.FORBIDDEN;
      case GrpcStatus.INVALID_ARGUMENT:
      case GrpcStatus.FAILED_PRECONDITION:
      case GrpcStatus.OUT_OF_RANGE:
        return HttpStatus.BAD_REQUEST;
      case GrpcStatus.UNAVAILABLE:
      case GrpcStatus.CANCELLED:
        return HttpStatus.SERVICE_UNAVAILABLE;
      case GrpcStatus.ALREADY_EXISTS:
        return HttpStatus.NOT_ACCEPTABLE;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
