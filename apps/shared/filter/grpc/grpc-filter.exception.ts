import { Catch, RpcExceptionFilter, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { ApiException } from '../../exception/api.exception';
import { RpcException } from '@nestjs/microservices';
import { GrpcException } from './grpc.exception';

@Catch()
export class GrpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException | HttpException | ApiException): Observable<unknown> {
    return throwError(() => {
      return new GrpcException(exception);
    });
  }
}
