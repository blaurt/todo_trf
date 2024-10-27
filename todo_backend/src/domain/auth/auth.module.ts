import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { Sign } from 'crypto';
import { UserLoginHandler } from './features/login/login.handler';
import { UserSignUpHandler } from './features/signup/signup.handler';
import { UserModule } from '../user/user.module';
import { RenewAccessTokenHandler } from './features/renew-access-token/renew-access-token.handler';

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    UserModule,
  ],
  providers: [UserLoginHandler, UserSignUpHandler, RenewAccessTokenHandler],
  exports: [UserLoginHandler, UserSignUpHandler],
})
export class AuthModule {}
