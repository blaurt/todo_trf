import { Module } from '@nestjs/common';
import { AuthModule } from 'src/domain/auth/auth.module';
import { AuthController } from './controllers/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule, AuthModule],
  controllers: [AuthController],
})
export class PublicApiModule {}
