import { DynamicModule, ExecutionContext, Module } from '@nestjs/common';
import { ClsModule, ClsService } from 'nestjs-cls';
import { CustomLoggerService } from './services/custom-logger.service';
import { CUSTOM_LOGGER_OPTION, LoggerModuleOptions } from './model/logger.option';
import { KafkaContext } from '@nestjs/microservices';
import { randomBytes } from 'crypto';

@Module({})
export class LoggerModule {
  static forRoot(options?: LoggerModuleOptions): DynamicModule {
    options = { ...new LoggerModuleOptions(), ...options };

    return {
      module: LoggerModule,
      imports: [
        ClsModule.forRoot({
          global: options.global,
          interceptor: {
            generateId: true,
            idGenerator: (ctx) => idGenerator(ctx, options),
            setup: (cls, context) => setup(cls, context, options),
            mount: true,
          },
        }),
      ],
      providers: [
        {
          provide: CUSTOM_LOGGER_OPTION,
          useValue: options,
        },
        CustomLoggerService,
      ],
      exports: [CustomLoggerService],
      global: options.global,
    };
  }
}

function setup(cls: ClsService, context: ExecutionContext, options: LoggerModuleOptions) {
  const args = context.getArgs();
  if (args.length >= 2 && args[1] instanceof KafkaContext) {
    cls.set('requestType', 'KAFKA');
    options.kafka.setup(cls, args[1], args[0], options);
  } else {
    cls.set('requestType', 'HTTP');
    options.kafka.setup(cls, args[0], args[1], options);
  }
}

function idGenerator(context: ExecutionContext, options: LoggerModuleOptions): string {
  const args = context.getArgs();
  if (args.length >= 2 && args[1] instanceof KafkaContext) {
    return options.kafka.idGenerator(args[1], args[0]);
  }

  if (args[0]?.url) {
    return (args[0]['id'] = options.http.idGenerator(args[0], args[1]));
  }

  return getRandomString();
}

function getRandomString(): string {
  return randomBytes(8).toString('hex');
}
