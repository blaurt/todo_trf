import { Controller, NotImplementedException, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

class UserPublicData {
  id: string;
  email: string;
  name: string;
  role: string;
  token: string;
}

class LoginResponse {
  user: UserPublicData;
  accessToken: string;
  refreshToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('login')
  async login(): Promise<LoginResponse> {
    throw new NotImplementedException();
  }

  @Post('signup')
  async signup(): Promise<void> {
    throw new NotImplementedException();
  }

  @Post('validate-token')
  async validateToken(): Promise<UserPublicData> {
    throw new NotImplementedException();
  }
}
