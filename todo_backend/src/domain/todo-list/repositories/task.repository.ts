import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { Injectable } from '@nestjs/common';

export interface ITaskRepository {
  upsert(task: Task): Promise<Task>;
  findOneById(id: Task['id']): Promise<Task | undefined>;
  softDelete(id: Task['id']): void;
  getAllForTodoList(todoListId: Task['todoList']['id']): Promise<Task[]>;
}

@Injectable()
export class TaskRepository implements ITaskRepository {
  constructor(@InjectRepository(Task) private readonly repository: Repository<Task>) {}

  upsert(task: Task): Promise<Task> {
    return this.repository.save(task);
  }

  findOneById(id: Task['id']): Promise<Task | undefined> {
    return this.repository.findOne({
      where: { id, deletedAt: null },
      relations: ['todoList', 'todoList.user'],
    });
  }

  softDelete(id: Task['id']): void {
    this.repository.softDelete(id);
  }

  getAllForTodoList(todoListId: Task['todoList']['id']): Promise<Task[]> {
    return this.repository.find({
      where: {
        todoList: {
          id: todoListId,
        },
        deletedAt: null,
      },
      relations: ['todoList', 'todoList.user'],
    });
  }
}
