import { Inject, Injectable, LoggerService, OnModuleDestroy } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { EnvService } from '../env/env.service';

type LogPayload = Record<string, any>;

@Injectable()
export class AppLoggerService implements LoggerService, OnModuleDestroy {
  private readonly isEnabled: boolean;
  constructor(
    @Inject('LOGGER') private readonly logger: LoggerService & { close: () => Promise<void> },
    private readonly env: EnvService,
    private readonly cls: ClsService,
  ) {
    this.isEnabled = true;
    if (this.env.get('NODE_ENV') === 'production') {
      return;
    }

    this.printenv();
  }

  async onModuleDestroy() {
    await this.logger.close();
  }

  log(message: string, logData: LogPayload = {}, isEnabled = this.isEnabled) {
    isEnabled && this.logger.log(message, { ...this.getContextMetadata(), logData });
  }

  error(message: string, logData: LogPayload = {}, isEnabled = this.isEnabled) {
    isEnabled && this.logger.error(message, { ...this.getContextMetadata(), logData });
  }

  warn(message: string, logData: LogPayload = {}, isEnabled = this.isEnabled) {
    isEnabled && this.logger.warn(message, { ...this.getContextMetadata(), logData });
  }

  debug(message: string, logData: LogPayload = {}, isEnabled = this.isEnabled) {
    isEnabled && this.logger.debug(message, { ...this.getContextMetadata(), logData });
  }

  private printenv() {
    this.logger.debug('Application started with env', {
      envVars: Object.keys(process.env)
        .sort()
        .map((key) => ({ [key]: process.env[key] })),
    });
  }

  private getContextMetadata() {
    return {
      entity: process.env.SERVICE_NAME,
      userId: this.cls.get('userId'),
      traceId: this.cls.getId(),
    };
  }
}
