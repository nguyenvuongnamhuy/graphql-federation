import { GrpcOptions } from '@nestjs/microservices';

export type GrpcConnectionInfo = Pick<GrpcOptions['options'], 'url' | 'maxSendMessageLength' | 'maxReceiveMessageLength' | 'loader'>;
