import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GetTodoListByIdResponse } from 'src/domain/todo-list/entities/dto/get-list-by-id.dto';
import { TodoList } from 'src/domain/todo-list/entities/todo-list.entity';
import { TodoListRepository } from 'src/domain/todo-list/repositories/todo-list.repository';
import { withLogger } from 'src/utils/app-logger/with-logger.decorator';
import { z } from 'zod';

export class UpdateTodoListCommand implements ICommand {
  todoListId: TodoList['id'];
  title: string;
  isPublic: boolean;
  description: string;
  userId: string;

  private readonly _schema = z.object({
    todoListId: z.string(),
    title: z.string().optional(),
    isPublic: z.boolean().optional(),
    description: z.string().optional(),
    userId: z.string(),
  });

  constructor(params: Partial<UpdateTodoListCommand>) {
    Object.assign(this, params);
    this._schema.parse(this);
  }
}

@CommandHandler(UpdateTodoListCommand)
export class UpdateTodoListHandler implements ICommandHandler<UpdateTodoListCommand> {
  constructor(private readonly todoListRepository: TodoListRepository) {}

  @withLogger()
  async execute(command: UpdateTodoListCommand): Promise<GetTodoListByIdResponse> {
    const todoList = await this.todoListRepository.findOneById(command.todoListId);

    if (!todoList) {
      throw new NotFoundException(`Todo list was not found`);
    }

    if (todoList.user.id !== command.userId) {
      throw new NotFoundException(`Todo list was not found`);
    }

    const updatePayload = {
      title: command.title,
      isPublic: command.isPublic,
      description: command.description,
    };

    const updatedList = await this.todoListRepository.upsert({ ...todoList, ...updatePayload });

    return new GetTodoListByIdResponse(updatedList);
  }
}
