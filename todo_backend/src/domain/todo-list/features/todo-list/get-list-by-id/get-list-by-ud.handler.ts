import { NotFoundException } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { GetTodoListByIdResponse } from 'src/domain/todo-list/entities/dto/get-list-by-id.dto';
import { Task } from 'src/domain/todo-list/entities/task.entity';
import { TodoList } from 'src/domain/todo-list/entities/todo-list.entity';
import { TodoListRepository } from 'src/domain/todo-list/repositories/todo-list.repository';
import { User } from 'src/domain/user/user.entity';
import { withLogger } from 'src/utils/app-logger/with-logger.decorator';
import { z } from 'zod';

export class GetTodoListByIdQuery implements IQuery {
  readonly userId: User['id'];

  @ApiProperty({
    type: String,
    description: `Id of a todo-list`,
    example: 'ca2aae28-dc31-4cda-a549-13201f12f18a',
  })
  readonly todoListId: string;

  private readonly _schema = z.object({
    userId: z.string(),
    todoListId: z.coerce.string(),
  });

  constructor(params: Partial<GetTodoListByIdQuery>) {
    Object.assign(this, params);

    this._schema.parse(this);
  }
}

@QueryHandler(GetTodoListByIdQuery)
export class GetTodoListByIdHandler implements IQueryHandler<GetTodoListByIdQuery> {
  constructor(private readonly todoListRepository: TodoListRepository) {}

  @withLogger()
  async execute(command: GetTodoListByIdQuery): Promise<GetTodoListByIdResponse> {
    const todoList = await this.todoListRepository.findOneById(command.todoListId);
    if (!todoList) {
      throw new NotFoundException('Todo list not found');
    }

    if (todoList.isPublic) {
      return new GetTodoListByIdResponse(todoList);
    }

    if (todoList.user.id !== command.userId) {
      throw new NotFoundException('Todo list not found');
    }

    return new GetTodoListByIdResponse(todoList);
  }
}
