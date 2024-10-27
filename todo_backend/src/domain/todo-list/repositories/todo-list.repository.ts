import { Entity, Repository } from 'typeorm';
import { TodoList } from '../entities/todo-list.entity';
import { User } from '../../user/user.entity';
import { ITodoListRepository } from './todo-list-repository.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Entity()
export class TodoListRepository implements ITodoListRepository {
  constructor(
    @InjectRepository(TodoList)
    private readonly repo: Repository<TodoList>,
  ) {}

  async findAllForUser(
    userId: User['id'],
    skip: number,
    limit: number,
  ): Promise<{
    todoLists: TodoList[];
    total: number;
  }> {
    const [todoLists, total] = await this.repo.findAndCount({
      where: {
        user: {
          id: userId,
          deletedAt: null,
        },
      },
      skip,
      take: limit,
      relations: ['user', 'tasks'],
    });

    return {
      todoLists,
      total,
    };
  }

  findOneById(id: TodoList['id']): Promise<TodoList | undefined> {
    return this.repo.findOne({ relations: ['user', 'tasks'], where: { id, deletedAt: null } });
  }

  upsert(todoList: TodoList): Promise<TodoList> {
    return this.repo.save(todoList);
  }

  softDelete(id: TodoList['id']): void {
    this.repo.softDelete({ id });
  }
}
