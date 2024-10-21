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
    console.log('🚀 ~ AllExceptionsFilter ~ exception:', exception, exception instanceof ZodError);
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let httpStatus;
    let message;
    switch (true) {
      case exception instanceof HttpException:
        httpStatus = exception.getStatus();
        message = exception.getResponse();
        break;
      case exception instanceof ZodError:
        httpStatus = HttpStatus.BAD_REQUEST;
        message = (exception as ZodError).issues;
        break;
      default:
        httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        message = "Internal server error";
        break;
    }
    exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      traceId: this.cls.getId(),
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    response.status(httpStatus).send(responseBody);
  }
}
