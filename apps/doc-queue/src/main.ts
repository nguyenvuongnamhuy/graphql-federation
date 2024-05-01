// import { NestFactory } from '@nestjs/core';
// import { DocQueueModule } from './doc-queue.module';

// async function bootstrap() {
//   const app = await NestFactory.create(DocQueueModule);
//   await app.listen(configService.get('DOC_QUEUE_PORT', '3033'));
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { LoggerService, ValidationPipe, VersioningType } from '@nestjs/common';
import { ClsServiceManager } from 'nestjs-cls';
import { getLoggerOptions } from 'apps/shared/config/logger.config';
import { ApiExceptionFilter } from 'apps/shared/filter/api.filter';
import { Environment } from 'apps/shared/enum/common.enum';
import { CustomLoggerService } from 'apps/shared/logger/services/custom-logger.service';
import { LoggingInterceptor } from 'apps/shared/interceptor/request-logging.interceptor';
import { DocQueueModule } from './doc-queue.module';

const logger = createLogger();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(DocQueueModule, {
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
      // whitelist: true,
      transform: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalFilters(new ApiExceptionFilter(configService));
  await app.listen(configService.get<string>('DOC_QUEUE_PORT', '3033'));
  logAppEnvInfo(configService, logger);
}

function logAppEnvInfo(configService: ConfigService, logger: LoggerService) {
  logger.log(`Node Environment: ${process.env['NODE_ENV']?.toUpperCase()}`, 'Bootstrap');
  const HOST = configService.get<string>('DOC_QUEUE_HOST', 'localhost');
  const PORT = configService.get<string>('DOC_QUEUE_PORT', '3033');

  process.env['NODE_ENV'] !== Environment.Production
    ? logger.log(`Server ready at http://${HOST}:${PORT}`, 'Bootstrap')
    : logger.log(`Server is listening on port ${PORT}`, 'Bootstrap');
}

function createLogger(): LoggerService {
  return new CustomLoggerService(ClsServiceManager.getClsService(), getLoggerOptions());
}

bootstrap();
