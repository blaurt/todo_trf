import { createLogger, format, transports, Logger as TWinstonLogger } from 'winston';
import { LoggerService } from '@nestjs/common';

type LogPayload = Record<string, any>;

export class WinstonLogger implements LoggerService {
  private logger: TWinstonLogger;

  constructor() {
    this.logger = createLogger({
      format: format.combine(format.json(), format.timestamp()),
      transports: [
        new transports.Console({
          format:
            process.env.NODE_ENV === 'production'
              ? format.simple()
              : format.combine(format.colorize(), format.simple()),
        }),
      ],
    });
  }

  log(message: string, payload: LogPayload = {}) {
    this.logger.info(message, payload);
  }

  info(message: string, payload: LogPayload = {}) {
    this.logger.info(message, payload);
  }

  error(message: string, payload: LogPayload = {}) {
    this.logger.error(message, payload);
  }

  warn(message: string, payload: LogPayload = {}) {
    this.logger.warn(message, payload);
  }

  debug(message: string, payload: LogPayload = {}) {
    this.logger.debug(message, payload);
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.logger.end(() => {
          this.logger.transports.forEach((transport) => {
            if (transport instanceof transports.File) {
              transport.close?.();
            }
          });

          resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}
