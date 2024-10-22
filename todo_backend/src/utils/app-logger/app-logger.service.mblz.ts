import { Injectable, LoggerService, OnModuleInit, } from '@nestjs/common';
import { ClsService, } from 'nestjs-cls';
import { createLogger, format, Logger, transports, } from 'winston';

const IS_ENABLED = true;

@Injectable()
export class AppLoggerService implements LoggerService, OnModuleInit {
  private readonly logger: Logger;

  constructor(private readonly cls: ClsService) {
    const transportOptions: any[] = [
      new transports.File({
        filename: `logfile.log`,
        dirname: 'logs',
      }),
    ];
    if (process.env.NODE_ENV !== 'test') {
      transportOptions.push(new transports.Console());
    }

    // TODO add error logging as 2nd stream into console
    // new winston.transports.Console({ level: 'error' }),

    const formats = [
      format.errors({ stack: true, }),
      format.timestamp(),
      format.json(),
    ];
    // if (process.env.APP_ENV === 'local') {
      formats.pop();
      formats.push(
        format.prettyPrint({
          colorize: true,
        })
      );
    // }

    this.logger = createLogger({
      format: format.combine(...formats),
      transports: transportOptions,
      level: process.env.NODE_ENV === 'test'
        ? 'error'
        : 'debug',
    });
  }

  public onModuleInit() {
    this.printenv();
  }

  private printenv() {
    this.logger.debug('Application started with env', {
      envVars: Object.keys(process.env)
        .sort()
        .map((key) => ({ [key]: process.env[key], })),
    });
  }

  public error(message: string, { tag, ...payload }: Record<any, any> = {}, isEnabled = IS_ENABLED): void {
    isEnabled
      && this.logger.error(message, {
        ...this.getAsyncContextData(),
        logData: payload,
        tag,
      });
  }

  public warn(message: string, { tag, ...payload }: Record<any, any> = {}, isEnabled = IS_ENABLED): void {
    isEnabled
      && this.logger.warn(message, {
        ...this.getAsyncContextData(),
        logData: payload,
        tag,
      });
  }

  public info(message: string, { tag, ...payload }: Record<any, any> = {}, isEnabled = IS_ENABLED): void {
    isEnabled
      && this.logger.info(message, {
        ...this.getAsyncContextData(),
        logData: payload,
        tag,
      });
  }

  public log(message: string, { tag, ...payload }: Record<any, any> = {}, isEnabled = IS_ENABLED): void {
    isEnabled && this.info(message, payload);
  }

  public verbose(message: string, { tag, ...payload }: Record<any, any> = {}, isEnabled = IS_ENABLED): void {
    isEnabled
      && this.logger.verbose(message, {
        ...this.getAsyncContextData(),
        logData: payload,
        tag,
      });
  }

  public debug(message: string, { tag, ...payload }: Record<any, any> = {}, isEnabled = IS_ENABLED): void {
    isEnabled
      && this.logger.debug(message, {
        ...this.getAsyncContextData(),
        logData: payload,
        tag,
      });
  }

  private getAsyncContextData(): Record<string, any> {
    return {
      entity: process.env.METAMINEZ_APP,
      userId: this.cls.get('userId'),
      traceId: this.cls.getId(),
    };
  }
}
