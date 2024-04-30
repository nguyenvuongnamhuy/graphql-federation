import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from '../enum/common.enum';

type ErrorProps = {
  code: string;
  message: string;
  status?: number;
  stack?: string;
};

export class ApiException extends HttpException {
  public code: string;
  public override message: string;
  public override stack?: string;

  constructor({ message, code }: ErrorProps) {
    super(message, HttpStatus.BAD_REQUEST);
    this.message = message;
    this.code = code;
  }

  toJSON(): ErrorProps {
    const configService = new ConfigService();
    return {
      status: this.getStatus(),
      code: this.code,
      message: this.message,
      stack: !Object.values([Environment.Staging, Environment.Production]).includes(configService.get('NODE_ENV')) ? this.stack : undefined,
    };
  }
}
