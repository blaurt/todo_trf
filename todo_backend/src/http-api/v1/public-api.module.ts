import { Module } from '@nestjs/common';
import { AuthModule } from 'src/domain/auth/auth.module';
import { AuthController } from './controllers/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TodoListController } from './controllers/todo-list.controller';
import { TodoListModule } from 'src/domain/todo-list/todo-list.module';
import { HealthController } from './controllers/healthcheck/health.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [CqrsModule, AuthModule, TodoListModule, TerminusModule],
  controllers: [AuthController, TodoListController, HealthController],
})
export class PublicApiModule {}
