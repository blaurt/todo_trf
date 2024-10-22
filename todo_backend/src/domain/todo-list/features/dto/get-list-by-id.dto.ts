import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../../entities/task.entity';
import { TodoList } from '../../entities/todo-list.entity';

export class GetTodoListByIdResponse {
  @ApiProperty({
    type: String,
    description: `Todo list id`,
  })
  id: string;

  @ApiProperty({
    type: String,
    description: `Todo list title`,
  })
  title: string;

  @ApiProperty({
    type: Boolean,
    description: `Shows if todolist is to be publicly available`,
  })
  isPublic: boolean;

  @ApiProperty({
    type: Date,
    description: `Todo list id`,
  })
  createdAt: Date;

  @ApiProperty({
    type: Task,
    isArray: true,
    description: `Item of a todo-list`,
  })
  tasks: Task[];

  constructor(todoList: TodoList) {
    console.log("🚀 ~ GetTodoListByIdResponse ~ constructor ~ todoList:", todoList)
    this.id = todoList.id;
    this.title = todoList.title;
    this.isPublic = todoList.isPublic;
    this.createdAt = todoList.createdAt;
    this.tasks = todoList.tasks || [];
  }
}
