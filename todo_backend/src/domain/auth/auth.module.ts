import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { Sign } from 'crypto';
import { UserLoginHandler } from './features/login/login.handler';
import { UserSignUpHandler } from './features/signup/signup.handler';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    UserModule,
  ],
  providers: [UserLoginHandler, UserSignUpHandler],
  exports: [UserLoginHandler, UserSignUpHandler],
})
export class AuthModule {}
