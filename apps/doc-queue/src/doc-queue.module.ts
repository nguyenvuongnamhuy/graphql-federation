import { Module } from '@nestjs/common';
import { DocQueueService } from './service/doc-queue.service';
import { DocQueueResolver } from './resolver/doc-queue.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
// import { ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled';
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
      // plugins: [ApolloServerPluginInlineTraceDisabled()], // enabling inline tracing for this subgraph.
      autoSchemaFile: {
        federation: 2,
      },
    }),
  ],
  providers: [DocQueueResolver, DocQueueService, DocsGrpcClientProvider],
})
export class DocQueueModule {}
