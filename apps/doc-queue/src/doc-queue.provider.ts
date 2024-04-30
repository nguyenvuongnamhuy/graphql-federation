import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { grpcOptions } from './grpc.config';
import { protobufPackage } from './proto/doc-queue';
import { DOCS_CLIENT_SERVICE } from 'apps/shared/constant';

export const DocsGrpcClientProvider: FactoryProvider = {
  provide: DOCS_CLIENT_SERVICE,
  useFactory: (configService: ConfigService) => {
    return ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        package: protobufPackage,
        protoPath: [join(__dirname, './proto/doc-queue.proto')],
        ...grpcOptions(configService),
      },
    });
  },
  inject: [ConfigService],
};
