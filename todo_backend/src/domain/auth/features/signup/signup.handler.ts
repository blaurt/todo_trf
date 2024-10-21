import { BadRequestException } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from 'src/domain/user/features/create-user.handler';
import { FindUserByEmailQuery } from 'src/domain/user/features/find-by-email.handler';
import { UserRepository } from 'src/domain/user/user.repository';
import { AppLoggerService } from 'src/utils/app-logger/app-logger.service';
import { withLogger } from 'src/utils/app-logger/with-logger.decorator';
import { z } from 'zod';

export class UserSignUpCommand implements ICommand {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly repeatPassword: string;

  private readonly _schema = z.object({
    email: z.string(),
    password: z.string(),
    repeatPassword: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  });

  constructor(params: Partial<UserSignUpCommand>) {
    Object.assign(this, params);

    this._schema.parse(this);
  }
}

@CommandHandler(UserSignUpCommand)
export class UserSignUpHandler implements ICommandHandler<UserSignUpCommand> {
  constructor(
    readonly commandBus: CommandBus,
    readonly logger: AppLoggerService,
    readonly userRepository: UserRepository,
    // readonly refreshToken: string,
  ) {}

  @withLogger()
  async execute(command: UserSignUpCommand): Promise<void> {
    const user = await this.userRepository.findByEmail(command.email);
    if (user) {
      throw new BadRequestException('User already exists');
    }

    if (command.password !== command.repeatPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    await this.commandBus.execute(
      new CreateUserCommand({
        firstName: command.firstName,
        lastName: command.lastName,
        email: command.email,
        password: command.password,
      }),
    );
  }
}
