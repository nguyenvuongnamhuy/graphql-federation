import { Module } from '@nestjs/common';
import { DocQueueService } from './doc-queue.service';
import { DocQueueResolver } from './doc-queue.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { getLoggerOptions } from 'apps/shared/config/logger.config';
import { LoggerModule } from 'apps/shared/logger/logger.module';
import { HealthModule } from 'apps/health/health.module';
import { DocsGrpcClientProvider } from './doc-queue.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot(getLoggerOptions()),
    HealthModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
  ],
  providers: [DocQueueResolver, DocQueueService, DocsGrpcClientProvider],
})
export class DocQueueModule {}
