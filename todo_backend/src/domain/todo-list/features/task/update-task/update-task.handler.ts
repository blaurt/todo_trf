import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { GetTaskByIdResponse } from 'src/domain/todo-list/entities/dto/get-task-by-id.dto';
import { TaskRepository } from 'src/domain/todo-list/repositories/task.repository';
import { withLogger } from 'src/utils/app-logger/with-logger.decorator';
import { z } from 'zod';

export class UpdateTaskCommand implements ICommand {
  readonly taskId: string;

  @ApiProperty({
    type: String,
    description: 'Task title',
    example: 'Buy groceries',
    required: false,
  })
  readonly title: string;

  @ApiProperty({
    type: String,
    description: 'Task description',
    example: 'For the week',
    required: false,
  })
  readonly description: string;

  @ApiProperty({
    type: Boolean,
    description: 'Is task completed',
    example: true,
    required: false,
  })
  readonly isCompleted: boolean;

  readonly userId: string;

  private readonly _schema = z.object({
    taskId: z.string(),
    title: z.string(),
    userId: z.string(),
    description: z.string(),
    isCompleted: z.boolean(),
  });

  constructor(params: Partial<UpdateTaskCommand>) {
    Object.assign(this, params);

    this._schema.parse(this);
  }
}

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand> {
  constructor(private readonly repository: TaskRepository) {}

  @withLogger()
  async execute(command: UpdateTaskCommand): Promise<GetTaskByIdResponse> {
    const task = await this.repository.findOneById(command.taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    if (task.todoList.user.id !== command.userId) {
      throw new Error('Task not found');
    }

    Object.assign(task, {
      isCompleted: command.isCompleted,
      completedAt: command.isCompleted ? new Date() : null,
      title: command.title,
      description: command.description,
    });

    const updatedTask = await this.repository.upsert(task);

    return new GetTaskByIdResponse(updatedTask);
  }
}
