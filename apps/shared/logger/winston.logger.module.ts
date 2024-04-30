import { DynamicModule, ExecutionContext, Module } from '@nestjs/common';
import { WinstonLogger } from './winston.logger';
import { ClsModule } from 'nestjs-cls';
import { randomBytes } from 'crypto';
import { WinstonLoggerModuleOptions } from './winston.logger.option';

@Module({})
export class WinstonLoggerModule {
  static forRoot(option?: WinstonLoggerModuleOptions): DynamicModule {
    return {
      module: WinstonLoggerModule,
      imports: [
        ClsModule.forRoot({
          global: option.isGlobal,
          interceptor: {
            generateId: true,
            idGenerator: (ctx) => idGenerator(ctx),
            mount: true,
          },
        }),
      ],
      providers: [WinstonLogger],
      global: option.isGlobal,
      exports: [WinstonLogger],
    };
  }
}

function idGenerator(context: ExecutionContext): string {
  const req = context.switchToHttp().getRequest<Request>();

  return (req['span-id'] = getRandomString());
}

function getRandomString(): string {
  return randomBytes(8).toString('hex');
}
