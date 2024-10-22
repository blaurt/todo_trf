import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LoginResult, UserLoginCommand } from 'src/domain/auth/features/login/login.handler';
import { RenewAccessTokenCommand } from 'src/domain/auth/features/renew-access-token/renew-access-token.handler';
import { UserSignUpCommand } from 'src/domain/auth/features/signup/signup.handler';
import { unknown } from 'zod';

class UserPublicData {
  id: string;
  email: string;
  name: string;
  role: string;
  token: string;
}

class LoginResponse {
  user: LoginResult['user'];
  access_token: string;

  constructor(params: Partial<LoginResult>) {
    this.user = params.user;
    this.access_token = params.access_token;
  }
}

@ApiBearerAuth()
@ApiTags('Quote requests')
@Controller({
  path: `/auth`,
})
export class AuthController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Creates new quote request' })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @Post('login')
  async login(@Body() body: unknown, @Res({ passthrough: true }) res: Response): Promise<LoginResponse> {
    const result = await this.commandBus.execute(new UserLoginCommand(body));

    // TODO no secure flag at this moment, until SSL is set up
    res.cookie('refresh_token', result.refresh_token, { httpOnly: true });
    return new LoginResponse(result);
  }

  @Post('signup')
  async signup(@Body() body: unknown): Promise<void> {
    return this.commandBus.execute(new UserSignUpCommand(body));
  }

  @Post('renew-token')
  async validateToken(@Req() req: Request): Promise<UserPublicData> {
    const refreshToken = req.cookies.refresh_token;
    return this.commandBus.execute(new RenewAccessTokenCommand(refreshToken));
  }
}
