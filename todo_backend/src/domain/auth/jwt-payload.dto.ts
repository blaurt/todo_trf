import { User } from '../user/user.entity';

export class JwtPayload {
  id: string;
  firstName: string;

  lastName: string;

  email: string;

  createdAt: Date;

  constructor(user: User) {
    this.createdAt = user.createdAt;
    this.email = user.email;
    this.firstName = user.firstName;
    this.id = user.id;
    this.lastName = user.lastName;
  }
}
