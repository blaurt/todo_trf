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
import { TodoList } from 'src/domain/todo-list/entities/todo-list.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from 'src/domain/auth/get-user.decorator';
import { JwtPayload } from 'src/domain/auth/jwt-payload.dto';
import { withLogger } from 'src/utils/app-logger/with-logger.decorator';
import { GetAllTodoListsForUserQuery } from 'src/domain/todo-list/features/todo-list/get-all-lists-for-user/get-all-lists-for-user.handler';
import { CreateTodoListCommand } from 'src/domain/todo-list/features/todo-list/create-todo-list/create-todo-list.handler';
import { GetTodoListByIdQuery } from 'src/domain/todo-list/features/todo-list/get-list-by-id/get-list-by-ud.handler';
import { UpdateTodoListCommand } from 'src/domain/todo-list/features/todo-list/update-todo-list/update-todo-list.handler';
import { SoftDeleteTodoListCommand } from 'src/domain/todo-list/features/todo-list/soft-delete-todo-list/soft-delete-todo-list.handler';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Todo Lists')
@Controller({
  path: `/todo-lists`,
})
export class TodoListsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fetch all todo-lists of a user, based on access-token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
  })
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
  @ApiResponse({ status: 404, description: 'NOT_FOUND' })
  @Get('/')
  @withLogger()
  async getTodoListForUser(
    @GetUser() user: JwtPayload,
    @Query('skip') skip: number = 0,
    @Query('limit') limit: number = 10,
  ): Promise<TodoList[]> {
    return this.queryBus.execute(new GetAllTodoListsForUserQuery({ userId: user.id, skip, limit }));
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fetch a single todo-list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
  })
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
  @ApiResponse({ status: 404, description: 'NOT_FOUND' })
  @Get('/:id')
  @withLogger()
  async getTodoListById(@Param('id') id: TodoList['id'], @GetUser() user: JwtPayload): Promise<TodoList | undefined> {
    return this.queryBus.execute(new GetTodoListByIdQuery({ userId: user.id, todoListId: id }));
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creates a new todo-list' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'OK',
  })
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
  @ApiResponse({ status: 404, description: 'NOT_FOUND' })
  @Post('/')
  @withLogger()
  async createTodoList(@Body() body: Record<any, unknown>, @GetUser() user: JwtPayload): Promise<TodoList> {
    return this.commandBus.execute(new CreateTodoListCommand({ ...body, userId: user.id }));
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Updates a todo-list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
  })
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
  @ApiResponse({ status: 404, description: 'NOT_FOUND' })
  @Patch('/:id')
  @withLogger()
  async updateTodoList(
    @Param('id') id: TodoList['id'],
    @GetUser() user: JwtPayload,
    @Body() body: Record<any, unknown>,
  ): Promise<void> {
    return this.commandBus.execute(new UpdateTodoListCommand({ todoListId: id, userId: user.id, ...body }));
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletes a todo-list' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'OK',
  })
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
  @ApiResponse({ status: 404, description: 'NOT_FOUND' })
  @Delete('/:id')
  @withLogger()
  async deleteTodoList(@Param('id') id: TodoList['id'], @GetUser() user: JwtPayload): Promise<void> {
    return this.commandBus.execute(new SoftDeleteTodoListCommand({ todoListId: id, userId: user.id }));
  }
}
