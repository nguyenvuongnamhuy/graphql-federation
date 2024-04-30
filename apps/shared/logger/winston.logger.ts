import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';
import { ClsService } from 'nestjs-cls';
import { Environment } from '../enum/common.enum';

export class WinstonLogger implements LoggerService {
  public readonly logger: winston.Logger;
  constructor(private readonly cls: ClsService) {
    const transports: winston.transport[] = [new winston.transports.Console()];
    if (process.env['NODE_ENV'] !== 'local' && process.env['NODE_ENV'] !== 'test') {
      const loggingWinston = new LoggingWinston();
      transports.push(loggingWinston);
    }

    this.logger = winston.createLogger({
      level: 'info',
      transports,
    });
  }

  public log(message: string, context?: string): winston.Logger {
    return this.logger.info(message, { context, ...this.addition() });
  }

  public error(message: string, context?: string): winston.Logger {
    return this.logger.error(message, { context, ...this.addition() });
  }

  public warn(message: string, context?: string): winston.Logger {
    return this.logger.warn(message, { context, ...this.addition() });
  }

  public debug(message: string, context?: string): winston.Logger {
    return this.logger.debug(message, { context, ...this.addition() });
  }

  public verbose(message: string, context?: string): winston.Logger {
    return this.logger.verbose(message, { context, ...this.addition() });
  }

  private addition() {
    return process.env['NODE_ENV'] !== Environment.Local
      ? {
          'logging.googleapis.com/spanId': this.cls.getId(),
        }
      : undefined;
  }
}
