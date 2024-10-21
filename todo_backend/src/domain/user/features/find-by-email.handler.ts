import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '../user.entity';
import { UserRepository } from '../user.repository';
import { NotFoundError } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

export class FindUserByEmailQuery implements IQuery {
  constructor(readonly email: string) {}
}

@QueryHandler(FindUserByEmailQuery)
export class FindUserByEmailHandler implements IQueryHandler<FindUserByEmailQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: FindUserByEmailQuery): Promise<User> {
    const user = await this.userRepository.findByEmail(query.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
