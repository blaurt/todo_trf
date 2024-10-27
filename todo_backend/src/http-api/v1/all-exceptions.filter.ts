import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';
import { AppLoggerService } from 'src/utils/app-logger/app-logger.service';
import { ZodError } from 'zod';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  public constructor(
    private readonly cls: ClsService,
    private readonly logger: AppLoggerService,
  ) {}

  public catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let httpStatus: number;
    let message;
    let details;

    response.setHeader('x-trace-id', this.cls.getId());
    switch (true) {
      case exception instanceof HttpException:
        httpStatus = exception.getStatus();
        message = exception.getResponse();
        return response.status(httpStatus).send(message);
        break;
      case exception instanceof ZodError:
        httpStatus = HttpStatus.BAD_REQUEST;
        message = 'Validation error';
        details = (exception as ZodError).errors;
        break;
      default:
        httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Internal server error';
        break;
    }

    // todo add path, timestamp, response code, traceId
    const responseBody = {
      message,
      details,
    };

    response.status(httpStatus).send(responseBody);
  }
}
