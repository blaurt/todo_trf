import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { composeDataSourceParams } from './utils/data/data-source';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvModule } from './utils/env/env.module';
import { EnvService } from './utils/env/env.service';
import { envSchema } from './utils/env/env.schema';
import { ClsModule } from 'nestjs-cls';
import { PublicApiModule } from './http-api/v1/public-api.module';
import { AppLoggerModule } from './utils/app-logger/app-logger.module';
import { v4 } from 'uuid';
import { RouterModule } from '@nestjs/core';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './http-api/v1/all-exceptions.filter';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local', '.env.test'],
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    TypeOrmModule.forRootAsync({
      useFactory: (env: EnvService) => composeDataSourceParams(),
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: () => v4(),
      },
    }),
    PassportModule,
    PublicApiModule,
    AppLoggerModule,
    RouterModule.register([
      {
        path: 'api/v1',
        module: PublicApiModule,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
//  implements OnApplicationBootstrap, NestModule {
//   constructor(private readonly dataSeeder: DataSeeder) {}

//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(HttpContextMiddleware).forRoutes('*');
//   }

//   async onApplicationBootstrap(): Promise<void> {
//     await this.dataSeeder.seedAsync();
//   }
// }
