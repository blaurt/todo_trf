import { CommandBus, CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { z } from 'zod';
import { TodoList } from '../../../entities/todo-list.entity';
import { FindUserByEmailQuery } from 'src/domain/user/features/find-by-email.handler';
import { UserRepository } from 'src/domain/user/repositories/user.repository';
import { withLogger } from 'src/utils/app-logger/with-logger.decorator';
import { BadRequestException } from '@nestjs/common';
import { TodoListRepository } from '../../../repositories/todo-list.repository';
import { ApiProperty } from '@nestjs/swagger';
import { GetTodoListByIdResponse } from 'src/domain/todo-list/entities/dto/get-list-by-id.dto';

export class CreateTodoListCommand implements ICommand {
  @ApiProperty({
    type: String,
    description: `Name of the list`,
    example: 'My first list',
  })
  title: string;

  userId: string;

  @ApiProperty({
    type: Boolean,
    description: `Whether the list is public or not`,
    example: false,
  })
  isPublic: boolean;

  private readonly _schema = z.object({
    title: z.string(),
    userId: z.string(),
    isPublic: z.boolean(),
  });

  constructor(params: Partial<CreateTodoListCommand>) {
    Object.assign(this, params);
    this._schema.parse(this);
  }
}

@CommandHandler(CreateTodoListCommand)
export class CreateTodoListHandler implements ICommandHandler<CreateTodoListCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly todoListRepository: TodoListRepository,
  ) {}

  @withLogger()
  async execute(command: CreateTodoListCommand) {
    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.status !== 'ACTIVE') {
      throw new BadRequestException('User is not active');
    }

    const todoList = await this.todoListRepository.upsert(
      new TodoList({
        title: command.title,
        user,
        isPublic: command.isPublic,
      }),
    );

    return new GetTodoListByIdResponse(todoList);
  }
}
