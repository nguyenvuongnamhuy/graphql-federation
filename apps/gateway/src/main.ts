// import { NestFactory } from '@nestjs/core';
// import { GatewayModule } from './gateway.module';

// async function bootstrap() {
//   const app = await NestFactory.create(GatewayModule);
//   await app.listen(configService.get<string>('GATEWAY_PORT', '3030'));
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { LoggerService, ValidationPipe, VersioningType } from '@nestjs/common';
import { ClsServiceManager } from 'nestjs-cls';
import { GatewayModule } from './gateway.module';
import { getLoggerOptions } from 'apps/shared/config/logger.config';
import { ApiExceptionFilter } from 'apps/shared/filter/api.filter';
import { Environment } from 'apps/shared/enum/common.enum';
import { CustomLoggerService } from 'apps/shared/logger/services/custom-logger.service';
import { LoggingInterceptor } from 'apps/shared/interceptor/request-logging.interceptor';

const logger = createLogger();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(GatewayModule, {
    cors: {
      origin: '*',
      // methods: 'GET,HEAD,PUT,POST,DELETE',
    },
  });

  app.disable('x-powered-by');

  const configService = app.get(ConfigService);
  app.useGlobalFilters(new ApiExceptionFilter(configService));

  app.useLogger(app.get(CustomLoggerService));

  app.useGlobalInterceptors(new LoggingInterceptor(ClsServiceManager.getClsService()));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalFilters(new ApiExceptionFilter(configService));
  await app.listen(configService.get<string>('GATEWAY_PORT', '3030'), '0.0.0.0');
  logAppEnvInfo(configService, logger);
}

function logAppEnvInfo(configService: ConfigService, logger: LoggerService) {
  logger.log(`Node Environment: ${process.env['NODE_ENV']?.toUpperCase()}`, 'Bootstrap');
  const HOST = configService.get<string>('GATEWAY_HOST', 'localhost');
  const PORT = configService.get<string>('GATEWAY_PORT', '3030');

  process.env['NODE_ENV'] !== Environment.Production
    ? logger.log(`Server ready at http://${HOST}:${PORT}`, 'Bootstrap')
    : logger.log(`Server is listening on port ${PORT}`, 'Bootstrap');
}

function createLogger(): LoggerService {
  return new CustomLoggerService(ClsServiceManager.getClsService(), getLoggerOptions());
}

bootstrap();
