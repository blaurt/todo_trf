import { Injectable } from '@nestjs/common'
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'

export class CreateUserCommand implements ICommand
  constructor(private userRepository: UserRepository) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const user = new User({
      email: input.email,
      password: input.password,
    });

    await this.userRepository.save(user);

    return {
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}




@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private userRepository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<CreateUserOutput> {
    return command.execute();
  }
}