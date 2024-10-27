import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from 'src/domain/auth/get-user.decorator';
import { JwtPayload } from 'src/domain/auth/jwt-payload.dto';
import { withLogger } from 'src/utils/app-logger/with-logger.decorator';
import { Task } from 'src/domain/todo-list/entities/task.entity';
import { GetTasksByListIdQuery } from 'src/domain/todo-list/features/task/get-tasks-by-list-id/get-tasks-by-list-id.handler';
import { GetTaskByIdQuery } from 'src/domain/todo-list/features/task/get-task-by-id/get-task-by-id.handler';
import { GetTaskByIdResponse } from 'src/domain/todo-list/entities/dto/get-task-by-id.dto';
import { UpdateTaskCommand } from 'src/domain/todo-list/features/task/update-task/update-task.handler';
import { CreateTaskCommand } from 'src/domain/todo-list/features/task/create-task/create-task.handler';
import { DeleteTaskCommand } from 'src/domain/todo-list/features/task/delete-task/delete-task.handler';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Todo Tasks')
@Controller({
  path: `/tasks`,
})
export class TasksController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fetch all todo-tasks of a user, based on access-token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
  })
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @Get('/')
  @withLogger()
  async getTodoTaskForUser(
    @GetUser() user: JwtPayload,
    @Query('skip') skip: number = 0,
    @Query('limit') limit: number = 10,
    @Query('todoListId') todoListId: string,
  ): Promise<GetTaskByIdResponse[]> {
    return this.queryBus.execute(new GetTasksByListIdQuery({ userId: user.id, todoListId: todoListId }));
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fetch all todo-tasks of a user, based on access-token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
  })
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @Get('/:id')
  @withLogger()
  async getTodoTaskById(@Param('id') id: Task['id'], @GetUser() user: JwtPayload): Promise<GetTaskByIdResponse> {
    return this.queryBus.execute(new GetTaskByIdQuery({ userId: user.id, taskId: id }));
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creates a new todo-task' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'OK',
  })
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @Post('/')
  @withLogger()
  async createTodoTask(@Body() body: Record<any, unknown>, @GetUser() user: JwtPayload): Promise<GetTaskByIdResponse> {
    return this.commandBus.execute(new CreateTaskCommand({ ...body, userId: user.id }));
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Updates a todo-task' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
  })
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @Patch('/:id')
  @withLogger()
  async updateTodoTask(
    @Param('id') id: Task['id'],
    @GetUser() user: JwtPayload,
    @Body() body: Record<any, unknown>,
  ): Promise<GetTaskByIdResponse> {
    return this.commandBus.execute(new UpdateTaskCommand({ taskId: id, userId: user.id, ...body }));
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletes a todo-task' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'OK',
  })
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @Delete('/:id')
  @withLogger()
  async deleteTodoTask(@Param('id') id: Task['id'], @GetUser() user: JwtPayload): Promise<void> {
    return this.commandBus.execute(new DeleteTaskCommand({ taskId: id, userId: user.id }));
  }
}
