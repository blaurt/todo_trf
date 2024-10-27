import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { TaskRepository } from 'src/domain/todo-list/repositories/task.repository';
import { withLogger } from 'src/utils/app-logger/with-logger.decorator';
import { z } from 'zod';

export class DeleteTaskCommand implements ICommand {
  @ApiProperty({
    type: String,
    description: 'Task ID',
    example: '02d351e5-1ae1-49ff-9b00-c62061f7ba1d',
  })
  readonly taskId: string;

  readonly userId: string;

  private readonly _schema = z.object({
    taskId: z.string(),
    userId: z.string(),
  });

  constructor(params: Partial<DeleteTaskCommand>) {
    Object.assign(this, params);

    this._schema.parse(this);
  }
}

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  constructor(private readonly taskRepository: TaskRepository) {}

  @withLogger()
  async execute(command: DeleteTaskCommand): Promise<void> {
    const task = await this.taskRepository.findOneById(command.taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task.todoList.user.id !== command.userId) {
      throw new NotFoundException('Task not found');
    }

    await this.taskRepository.softDelete(command.taskId);
  }
}
