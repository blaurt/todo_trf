import { User } from '../user.entity';

export interface IUserRepository {
  create: (newUser: User) => Promise<User>;
  findByEmail: (email: User['email']) => Promise<User | null>;
}

export const IUserRepositoryToken = Symbol('IUserRepository');
