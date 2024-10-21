import _ from 'lodash';
import { AppLoggerService } from './app-logger.service';

let _logger: AppLoggerService;
type LogDecoratorOptions = {
  force: boolean; // for debugging purpose you can disable all logs with "isEnabled" and ignore false with this option
  isEnabled: boolean;
  omitArgs: boolean;
  omitResult: boolean;
  logLevel: 'log' | 'warn' | 'error' | 'debug';
  tag?: string; // to query specific logs
};

const DEFAULT_OPTIONS: LogDecoratorOptions = {
  force: false,
  isEnabled: true,
  tag: undefined,
  omitArgs: false,
  omitResult: false,
  logLevel: 'log',
};

/**
 *  Options are to be provided on decorator applying .
 *  We can implement any optional behavior according to our needs
 */
export function withLogger(options: Partial<LogDecoratorOptions> = DEFAULT_OPTIONS) {
  options = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  return function _loggerDecoratorInternal(target: any, methodName: string, descriptor: PropertyDescriptor) {
    const className = target.constructor.name;
    const method = descriptor.value;
    const logLevel = options.logLevel;
    let startTime: [number, number];
    descriptor.value = async function (...args: any[]) {
      try {
        const strippedArgs = options.omitArgs ? 'args are omitted' : JSON.stringify(args);

        if (options.isEnabled || options.force) {
          _logger[logLevel](
            `[${className}]::${methodName} - called with args`,
            {
              args: strippedArgs,
              tag: options.tag,
            },
            options.isEnabled || options.force,
          );
        }

        startTime = process.hrtime();

        const result = await method.apply(this, args);
        const endTime = process.hrtime(startTime);
        const executionTime = endTime[0] * 1000 + endTime[1] / 1000000; // Convert to milliseconds

        if (options.isEnabled || options.force) {
          _logger[logLevel](
            `[${className}]::${methodName} - finished with a result`,
            {
              methodResult: !!options.omitResult ? 'returned value is omitted' : result,
              executionTime,
              tag: options.tag,
            },
            options.isEnabled || options.force,
          );
        }

        return result;
      } catch (error) {
        const endTime = process.hrtime(startTime);
        const executionTime = endTime[0] * 1000 + endTime[1] / 1000000; // Convert to milliseconds
        if (options.isEnabled || options.force) {
          _logger.error(
            `[${className}]::${methodName} - failed with an error`,
            {
              err: _.isFunction(error.toString) ? error.toString() : error,
              stack: error.stack,
              executionTime,
              tag: options.tag,
            },
            options.isEnabled || options.force,
          );
        }

        throw error;
      }
    };

    return descriptor;
  };
}

export function initLoggerDecorator(logger: AppLoggerService): void {
  _logger = logger;
}
