import { Delete, Get, Module } from '@nestjs/common';
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
import { CreateTaskHandler } from './features/task/create-task/create-task.handler';
import { TaskRepository } from './repositories/task.repository';
import { UpdateTaskHandler } from './features/task/update-task/update-task.handler';
import { GetTasksByListIdHandler } from './features/task/get-tasks-by-list-id/get-tasks-by-list-id.handler';
import { DeleteTaskHandler } from './features/task/delete-task/delete-task.handler';
import { GetTaskByIdHandler } from './features/task/get-task-by-id/get-task-by-id.handler';

@Module({
  imports: [CqrsModule, UserModule, TypeOrmModule.forFeature([TodoList, Task, User])],
  providers: [
    TodoListRepository,
    CreateTodoListHandler,
    GetAllTodoListsForUserHandler,
    GetTodoListByIdHandler,
    UpdateTodoListHandler,
    SoftDeleteTodoListHandler,
    // tasks
    TaskRepository,
    CreateTaskHandler,
    UpdateTaskHandler,
    GetTasksByListIdHandler,
    DeleteTaskHandler,
    GetTaskByIdHandler,
  ],
})
export class TodoListModule {}
