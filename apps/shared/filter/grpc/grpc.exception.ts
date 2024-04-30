import { HttpException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ApiException } from '../../exception/api.exception';
import { GrpcMapping } from './grpc-status-mapping.exception';
import { MetadataEx } from 'apps/shared/util/grpc-metadata.util';

export class GrpcException extends RpcException {
  public code!: number;
  public override message!: string;
  public metadata: MetadataEx | undefined;

  constructor(error: RpcException | HttpException | ApiException) {
    super(error);
    this.message = error.message;
    this.code = error['code'] || GrpcMapping.convertHttpToGrpcStatus(error['status']);
    this.metadata = error['metadata'] || this.setMetadata(this.code + '', this.message);
  }

  setMetadata(errorCode: string, message: string): MetadataEx {
    const metadata = new MetadataEx();
    metadata.add('ERROR_CODE', errorCode);
    metadata.add('MESSAGE', message);

    return metadata;
  }
}
