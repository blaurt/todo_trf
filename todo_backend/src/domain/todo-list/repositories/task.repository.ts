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
    throw new Error('Method not implemented.');
  }
  findOneById(id: Task['id']): Promise<Task | undefined> {
    throw new Error('Method not implemented.');
  }
  softDelete(id: Task['id']): void {
    throw new Error('Method not implemented.');
  }
  getAllForTodoList(todoListId: Task['todoList']['id']): Promise<Task[]> {
    throw new Error('Method not implemented.');
  }
}
