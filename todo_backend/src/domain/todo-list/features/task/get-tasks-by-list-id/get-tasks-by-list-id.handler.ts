import { IQuery, IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { Task } from 'src/domain/todo-list/entities/task.entity';
import { withLogger } from 'src/utils/app-logger/with-logger.decorator';
import { z } from 'zod';
import { GetTodoListByIdQuery } from '../../todo-list/get-list-by-id/get-list-by-ud.handler';
import { ApiProperty } from '@nestjs/swagger';
import { GetTaskByIdResponse } from 'src/domain/todo-list/entities/dto/get-task-by-id.dto';
import { TodoList } from 'src/domain/todo-list/entities/todo-list.entity';

export class GetTasksByListIdQuery implements IQuery {
  readonly userId: string;

  @ApiProperty({
    type: String,
    description: `Id of a todo-list`,
    example: '81792238-006d-4dc0-ae18-c6be316c833a',
  })
  readonly todoListId: string;

  private readonly _schema = z.object({
    todoListId: z.string(),
    userId: z.string(),
  });

  constructor(params: Partial<GetTasksByListIdQuery>) {
    Object.assign(this, params);

    this._schema.parse(this);
  }
}

@QueryHandler(GetTasksByListIdQuery)
export class GetTasksByListIdHandler implements IQueryHandler<GetTasksByListIdQuery> {
  constructor(private readonly queryBus: QueryBus) {
    this.queryBus = queryBus;
  }

  @withLogger()
  async execute(command: GetTasksByListIdQuery): Promise<GetTaskByIdResponse[]> {
    const todoList = await this.queryBus.execute<GetTodoListByIdQuery, TodoList>(
      new GetTodoListByIdQuery({ userId: command.userId, todoListId: command.todoListId }),
    );

    return todoList.tasks.map((task) => {
      task.todoList = todoList;
      return new GetTaskByIdResponse(task);
    });
  }
}
