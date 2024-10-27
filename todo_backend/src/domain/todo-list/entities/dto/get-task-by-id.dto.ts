import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../task.entity';

export class GetTaskByIdResponse {
  @ApiProperty({
    type: String,
    description: `Task id`,
    example: 'fea50ffd-bb27-4481-aa84-30f615f05a54',
  })
  readonly id: string;

  @ApiProperty({
    type: String,
    description: `Task title`,
    example: 'Buy groceries',
  })
  readonly title: string;

  @ApiProperty({
    type: String,
    description: `Task description`,
    example: 'For the week',
  })
  readonly description: string;

  @ApiProperty({
    type: Date,
    description: `Task creation date`,
    example: '2024-09-01T00:00:00.000Z',
  })
  readonly createdAt: Date;

  @ApiProperty({
    type: Boolean,
    description: `Is task completed`,
    example: false,
  })
  readonly isCompleted: boolean;

  @ApiProperty({
    type: Date,
    nullable: true,
    description: `Task completion date`,
    example: '2024-09-01T00:00:00.000Z',
  })
  readonly completedAt: Date;

  @ApiProperty({
    type: String,
    description: `Todo list id`,
    example: 'fea50ffd-bb27-4481-aa84-30f615f05a54',
  })
  readonly todoListId: string;

  constructor(task: Task) {
    this.id = task.id;
    this.title = task.title;
    this.description = task.description;
    this.createdAt = task.createdAt;
    this.isCompleted = task.completedAt !== null;
    this.completedAt = task.completedAt;
    this.todoListId = task.todoList.id;
  }
}
