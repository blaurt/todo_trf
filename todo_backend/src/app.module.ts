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
import { AuthController } from './http-api/v1/controllers/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from './domain/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
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
   
    AppLoggerModule,
    PublicApiModule,
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
