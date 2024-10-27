import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClsMiddleware, ClsService } from 'nestjs-cls';
import { v4 } from 'uuid';
import { EnvService } from './utils/env/env.service';
import { AppLoggerService } from './utils/app-logger/app-logger.service';
import { initializeDatabase } from './utils/data/data-source';
import { AllExceptionsFilter } from './http-api/v1/all-exceptions.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  initializeDatabase();
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(cookieParser());

  const port = process.env.PORT;
  const envService = app.get(EnvService);

  app.enableShutdownHooks();
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.getHttpAdapter().getInstance().disable('x-powered-by');
  const config = new DocumentBuilder()
    .setTitle(`${envService.get('SERVICE_NAME')} api`)
    .setDescription(`${envService.get('SERVICE_NAME')} api description`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(port);
}
bootstrap();
