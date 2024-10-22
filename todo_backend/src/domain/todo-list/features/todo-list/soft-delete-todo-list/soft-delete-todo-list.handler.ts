import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { TodoList } from 'src/domain/todo-list/entities/todo-list.entity';
import { TodoListRepository } from 'src/domain/todo-list/repositories/todo-list.repository';
import { withLogger } from 'src/utils/app-logger/with-logger.decorator';
import { z } from 'zod';

export class SoftDeleteTodoListCommand implements ICommand {
  todoListId: TodoList['id'];
  userId: string;

  private readonly _schema = z.object({
    todoListId: z.string(),
    userId: z.string(),
  });

  constructor(params: Partial<SoftDeleteTodoListCommand>) {
    Object.assign(this, params);

    this._schema.parse(this);
  }
}

@CommandHandler(SoftDeleteTodoListCommand)
export class SoftDeleteTodoListHandler implements ICommandHandler<SoftDeleteTodoListCommand> {
  constructor(private readonly todoListRepository: TodoListRepository) {}

  @withLogger()
  async execute(command: SoftDeleteTodoListCommand): Promise<void> {
    const todoList = await this.todoListRepository.findOneById(command.todoListId);

    if (!todoList) {
      throw new NotFoundException(`Todo list was not found`);
    }

    if (todoList.user.id !== command.userId) {
      throw new NotFoundException(`Todo list was not found`);
    }

    await this.todoListRepository.softDelete(command.todoListId);
  }
}
