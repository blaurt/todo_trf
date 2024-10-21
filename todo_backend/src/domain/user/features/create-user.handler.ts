import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../user.repository';
import { User } from '../user.entity';
import { UserStatus } from '../user-status.enum';
import { EnvService } from 'src/utils/env/env.service';
import { withLogger } from 'src/utils/app-logger/with-logger.decorator';
import { z } from 'zod';

export class CreateUserCommand implements ICommand {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;

  private readonly _schema = z.object({
    email: z.string(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  });

  constructor(params: Partial<CreateUserCommand>) {
    Object.assign(this, params);

    this._schema.parse(this);
  }
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly env: EnvService,
  ) {}

  @withLogger()
  async execute(input: CreateUserCommand): Promise<User> {
    const isAutoValidationEnabled = this.env.get('AUTOVALIDATE_EMAIL');
    const user = new User({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      status: isAutoValidationEnabled ? UserStatus.ACTIVE : UserStatus.NOT_VERIFIED,
    });

    user.passwordHash = await user.encryptPassword(input.password);

    return this.userRepository.create(user);
  }
}
