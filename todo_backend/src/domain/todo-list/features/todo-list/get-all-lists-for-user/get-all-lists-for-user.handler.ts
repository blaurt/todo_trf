import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { GetTodoListByIdResponse } from 'src/domain/todo-list/entities/dto/get-list-by-id.dto';
import { TodoList } from 'src/domain/todo-list/entities/todo-list.entity';
import { TodoListRepository } from 'src/domain/todo-list/repositories/todo-list.repository';
import { User } from 'src/domain/user/user.entity';
import { withLogger } from 'src/utils/app-logger/with-logger.decorator';
import { z } from 'zod';

export class GetAllTodoListsForUserResponse {
  @ApiProperty({
    type: TodoList,
    isArray: true,
    description: `List of the user's todo-lists`,
  })
  todoLists: GetTodoListByIdResponse[];

  @ApiProperty({
    type: Number,
    description: `Total number of todo-lists for the user`,
    example: 20,
  })
  total: number;
}

export class GetAllTodoListsForUserQuery implements IQuery {
  readonly userId: User['id'];

  @ApiProperty({
    type: Number,
    description: `Page number`,
    example: 0,
  })
  readonly skip: number;

  @ApiProperty({
    type: Number,
    description: `Page size`,
    example: 10,
  })
  readonly limit: number;

  private readonly _schema = z.object({
    userId: z.string(),
    skip: z.coerce.string(),
    limit: z.coerce.number(),
  });

  constructor(params: Partial<GetAllTodoListsForUserQuery>) {
    Object.assign(this, params);

    this._schema.parse(this);
  }
}

@QueryHandler(GetAllTodoListsForUserQuery)
export class GetAllTodoListsForUserHandler implements IQueryHandler<GetAllTodoListsForUserQuery> {
  constructor(private readonly todoListRepository: TodoListRepository) {}

  @withLogger()
  async execute(command: GetAllTodoListsForUserQuery): Promise<GetAllTodoListsForUserResponse> {
    const { todoLists: lists, total } = await this.todoListRepository.findAllForUser(
      command.userId,
      command.skip,
      command.limit,
    );

    return {
      todoLists: lists.map((dto: TodoList) => new GetTodoListByIdResponse(dto)),
      total,
    };
  }
}
