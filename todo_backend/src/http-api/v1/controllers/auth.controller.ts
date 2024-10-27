import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserLoginCommand } from 'src/domain/auth/features/login/login.handler';
import { RenewAccessTokenCommand } from 'src/domain/auth/features/renew-access-token/renew-access-token.handler';
import { UserSignUpCommand } from 'src/domain/auth/features/signup/signup.handler';
import { LoginResponse } from './auth/dto/login-response.dto';
import { EnvService } from '../../../utils/env/env.service';

@ApiTags('Auth')
@Controller({
  path: `/auth`,
})
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly envService: EnvService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logs a user in' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: LoginResponse,
  })
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @Post('login')
  async login(@Body() body: UserLoginCommand, @Res({ passthrough: true }) res: Response): Promise<LoginResponse> {
    const result = await this.commandBus.execute(new UserLoginCommand(body));

    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: this.envService.get('NODE_ENV') === 'production',
      maxAge: +this.envService.get('JWT_REFRESH_TOKEN_TTL'),
      path: '/',
    });
    return new LoginResponse(result);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'OK',
  })
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @Post('signup')
  async signup(@Body() body: UserSignUpCommand): Promise<void> {
    return this.commandBus.execute(new UserSignUpCommand(body));
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fetch new access token with a refresh token' })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @Post('renew-token')
  async validateToken(@Req() req: Request): Promise<{
    access_token: string;
  }> {
    const refreshToken = req.cookies.refresh_token;
    return {
      access_token: await this.commandBus.execute(new RenewAccessTokenCommand(refreshToken)),
    };
  }
}
