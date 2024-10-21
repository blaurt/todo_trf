import { Global, Module, OnModuleInit } from '@nestjs/common';
import { AppLoggerService } from './app-logger.service';
import { WinstonLogger } from './winston-logger';
import { initLoggerDecorator } from './with-logger.decorator';

@Global()
@Module({
  providers: [{ useClass: WinstonLogger, provide: 'LOGGER' }, AppLoggerService],
  exports: [AppLoggerService],
})
export class AppLoggerModule implements OnModuleInit {
  constructor(private readonly logger: AppLoggerService) {}
  onModuleInit() {
    initLoggerDecorator(this.logger);
  }
}
