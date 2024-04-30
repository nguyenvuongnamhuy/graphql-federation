import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { IntrospectAndCompose } from '@apollo/gateway';
import { ConfigModule } from '@nestjs/config';
import { getLoggerOptions } from 'apps/shared/config/logger.config';
import { LoggerModule } from 'apps/shared/logger/logger.module';
import { HealthModule } from 'apps/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // WinstonLoggerModule.forRoot({
    //   isGlobal: true,
    // }),
    LoggerModule.forRoot(getLoggerOptions()),
    HealthModule,
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      // server: {
      //   // ... Apollo server options
      //   cors: true,
      // },
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'users', url: 'http://localhost:3031/graphql' },
            { name: 'posts', url: 'http://localhost:3032/graphql' },
            { name: 'doc-queue', url: 'http://localhost:3033/graphql' },
          ],
        }),
      },
    }),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
