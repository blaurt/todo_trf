import { Module } from '@nestjs/common';
import { AuthModule } from 'src/domain/auth/auth.module';
import { AuthController } from './controllers/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TodoListController } from './controllers/todo-list.controller';
import { TodoListModule } from 'src/domain/todo-list/todo-list.module';

@Module({
  imports: [CqrsModule, AuthModule, TodoListModule],
  controllers: [AuthController, TodoListController],
})
export class PublicApiModule {}
