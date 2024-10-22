import { NotFoundException } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/domain/user/repositories/user.repository';
import { User } from 'src/domain/user/user.entity';
import { AppLoggerService } from 'src/utils/app-logger/app-logger.service';
import { withLogger } from 'src/utils/app-logger/with-logger.decorator';
import { EnvService } from 'src/utils/env/env.service';
import { z } from 'zod';
import { JwtPayload } from '../../jwt-payload.dto';

export class LoginResult {
  access_token: string;
  refresh_token: string;
  user: JwtPayload;

  constructor(params: Partial<LoginResult>) {
    Object.assign(this, params);
  }
}

export class UserLoginCommand implements ICommand {
  readonly email: string;
  readonly password: string;

  private readonly _schema = z.object({
    email: z.string(),
    password: z.string(),
  });

  constructor(params: Partial<UserLoginCommand>) {
    Object.assign(this, params);

    this._schema.parse(this);
  }
}

@CommandHandler(UserLoginCommand)
export class UserLoginHandler implements ICommandHandler<UserLoginCommand> {
  constructor(
    readonly commandBus: CommandBus,
    readonly logger: AppLoggerService,
    readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly env: EnvService,
  ) {}

  @withLogger()
  async execute(command: UserLoginCommand): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(command.email);
    if (!user) {
      throw new NotFoundException('Invalid email or password');
    }

    const isPasswordCorrect = await user.isPasswordMatch(command.password);
    if (!isPasswordCorrect) {
      throw new NotFoundException('Invalid email or password');
    }

    const userData = new JwtPayload(user);

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync({ ...userData }, { expiresIn: this.env.get('JWT_ACCESS_TOKEN_TTL') }),
      this.jwtService.signAsync({ ...userData }, { expiresIn: this.env.get('JWT_REFRESH_TOKEN_TTL') }),
    ]);

    return new LoginResult({
      access_token,
      refresh_token,
      user: userData,
    });
  }
}
