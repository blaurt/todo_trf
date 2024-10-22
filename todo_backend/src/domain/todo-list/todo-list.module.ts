import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoList } from './entities/todo-list.entity';
import { Task } from './entities/task.entity';
import { TodoListRepository } from './repositories/todo-list.repository';
import { CreateTodoListHandler } from './features/todo-list/create-todo-list/create-todo-list.handler';
import { UserModule } from '../user/user.module';
import { User } from '../user/user.entity';
import { GetAllTodoListsForUserHandler } from './features/todo-list/get-all-lists-for-user/get-all-lists-for-user.handler';
import { GetTodoListByIdHandler } from './features/todo-list/get-list-by-id/get-list-by-ud.handler';
import { SoftDeleteTodoListHandler } from './features/todo-list/soft-delete-todo-list/soft-delete-todo-list.handler';
import { UpdateTodoListHandler } from './features/todo-list/update-todo-list/update-todo-list.handler';

@Module({
  imports: [CqrsModule, UserModule, TypeOrmModule.forFeature([TodoList, Task, User])],
  providers: [
    TodoListRepository,
    CreateTodoListHandler,
    GetAllTodoListsForUserHandler,
    GetTodoListByIdHandler,
    UpdateTodoListHandler,
    SoftDeleteTodoListHandler,
  ],
})
export class TodoListModule {}
