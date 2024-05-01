import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { IntrospectAndCompose } from '@apollo/gateway';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getLoggerOptions } from 'apps/shared/config/logger.config';
import { LoggerModule } from 'apps/shared/logger/logger.module';
import { HealthModule } from 'apps/health/health.module';

const getPathGraphQL = (host, port) => `http://${host}:${port}/graphql`;

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
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      useFactory: (configService: ConfigService) => ({
        // cors: {
        //   origin: true,
        //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        //   credentials: true,
        // },
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              {
                name: 'users',
                url: getPathGraphQL(configService.get<string>('USERS_HOST', 'localhost'), configService.get<string>('USERS_PORT', '3031')),
              },
              {
                name: 'posts',
                url: getPathGraphQL(configService.get<string>('POSTS_HOST', 'localhost'), configService.get<string>('POSTS_PORT', '3032')),
              },
              {
                name: 'doc-queue',
                url: getPathGraphQL(configService.get<string>('DOC_QUEUE_HOST', 'localhost'), configService.get<string>('DOC_QUEUE_PORT', '3033')),
              },
            ],
          }),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
