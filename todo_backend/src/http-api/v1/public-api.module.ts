import { Module } from '@nestjs/common';
import { AuthModule } from 'src/domain/auth/auth.module';
import { AuthController } from './controllers/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TodoListsController } from './controllers/todo-list.controller';
import { TodoListModule } from 'src/domain/todo-list/todo-list.module';
import { HealthController } from './controllers/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { TasksController } from './controllers/tasks.controller';

@Module({
  imports: [CqrsModule, AuthModule, TodoListModule, TerminusModule],
  controllers: [HealthController, AuthController, TodoListsController, TasksController],
})
export class PublicApiModule {}
