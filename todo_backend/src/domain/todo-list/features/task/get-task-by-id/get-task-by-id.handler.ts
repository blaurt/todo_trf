import { NotFoundException } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTaskByIdResponse } from 'src/domain/todo-list/entities/dto/get-task-by-id.dto';
import { TaskRepository } from 'src/domain/todo-list/repositories/task.repository';
import { withLogger } from 'src/utils/app-logger/with-logger.decorator';
import { z } from 'zod';

export class GetTaskByIdQuery implements IQuery {
  readonly taskId: string;
  readonly userId: string;

  private readonly _schema = z.object({
    taskId: z.string(),
    userId: z.string(),
  });

  constructor(params: Partial<GetTaskByIdQuery>) {
    Object.assign(this, params);

    this._schema.parse(this);
  }
}

@QueryHandler(GetTaskByIdQuery)
export class GetTaskByIdHandler implements IQueryHandler<GetTaskByIdQuery> {
  constructor(private readonly taskRepository: TaskRepository) {}

  @withLogger()
  async execute(query: GetTaskByIdQuery) {
    const task = await this.taskRepository.findOneById(query.taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.todoList.user.id !== query.userId) {
      throw new NotFoundException('Task not found');
    }

    return new GetTaskByIdResponse(task);
  }
}
