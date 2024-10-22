import { User } from 'src/domain/user/user.entity';
import { TodoList } from '../entities/todo-list.entity';

export interface ITodoListRepository {
  findAllForUser: (
    userId: User['id'],
    skip: number,
    limit: number,
  ) => Promise<{
    todoLists: TodoList[];
    total: number;
  }>;
  findOneById: (id: TodoList['id']) => Promise<TodoList | undefined>;
  upsert: (todoList: TodoList) => Promise<TodoList>;
  softDelete: (id: TodoList['id']) => void;
}

export const ITodoListRepositoryToken = Symbol('ITodoListRepository');
