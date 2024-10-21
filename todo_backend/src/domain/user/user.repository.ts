import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from './repositories/iuser-repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(newUser: User): Promise<User> {
    return this.usersRepository.save(newUser);
  }

  async findByEmail(email: User['email']): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
}
