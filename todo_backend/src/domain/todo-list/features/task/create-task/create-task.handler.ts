import { CommandHandler, ICommand, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { Task } from 'src/domain/todo-list/entities/task.entity';
import { TaskRepository } from 'src/domain/todo-list/repositories/task.repository';
import { withLogger } from 'src/utils/app-logger/with-logger.decorator';
import { z } from 'zod';
import { GetTodoListByIdQuery } from '../../todo-list/get-list-by-id/get-list-by-ud.handler';
import { GetTaskByIdResponse } from 'src/domain/todo-list/entities/dto/get-task-by-id.dto';

export class CreateTaskCommand implements ICommand {
  readonly title: string;
  readonly description: string;
  readonly todoListId: string;
  readonly userId: string;

  private readonly _schema = z.object({
    title: z.string().min(1),
    description: z.string(),
    todoListId: z.string(),
    userId: z.string(),
  });

  constructor(params: Partial<CreateTaskCommand>) {
    Object.assign(this, params);

    this._schema.parse(this);
  }
}

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly queryBus: QueryBus,
  ) {}

  @withLogger()
  async execute(command: CreateTaskCommand): Promise<GetTaskByIdResponse> {
    const todoList = await this.queryBus.execute(
      new GetTodoListByIdQuery({ userId: command.userId, todoListId: command.todoListId }),
    );

    const task = await this.taskRepository.upsert(
      new Task({
        title: command.title,
        description: command.description,
        todoList,
      }),
    );

    return new GetTaskByIdResponse(task);
  }
}
