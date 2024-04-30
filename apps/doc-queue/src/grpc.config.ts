import { ConfigService } from '@nestjs/config';
import { GrpcConnectionInfo } from 'apps/shared/type/grpc.connectionInfo.type';

export const grpcOptions = (configService: ConfigService): GrpcConnectionInfo => {
  return {
    url: configService.get('DOCS_API_GRPC_URL'),
    maxSendMessageLength: configService.get('DOCS_GRPC_MAX_MESSAGE_LENGTH'),
    maxReceiveMessageLength: configService.get('DOCS_GRPC_MAX_MESSAGE_LENGTH'),
    // keepalive: { keepaliveTimeMs: 600000 },
    loader: {
      defaults: true,
      longs: Number,
    },
  };
};
