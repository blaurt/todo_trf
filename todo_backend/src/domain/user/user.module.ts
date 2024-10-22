import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './repositories/user.repository';
import { CreateUserHandler } from './features/create-user.handler';
import { FindUserByEmailHandler } from './features/find-by-email.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User])],
  providers: [UserRepository, CreateUserHandler, FindUserByEmailHandler],
  exports: [UserRepository, CreateUserHandler, FindUserByEmailHandler],
})
export class UserModule {}
