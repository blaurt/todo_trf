import { ApiProperty } from "@nestjs/swagger";
import { LoginResult } from "../../../../../domain/auth/features/login/login.handler";
import { JwtPayload } from "../../../../../domain/auth/jwt-payload.dto";
import { UserStatus } from "../../../../../domain/user/user-status.enum";
import { User } from "../../../../../domain/user/user.entity";

export class LoginResponse {
  @ApiProperty({
    type: JwtPayload,
    description: 'User public data',
    required: true,
    example: new JwtPayload(
      new User({
        createdAt: new Date(),
        email: 'myemail@example.com',
        id: '1c8a3eb8-5add-4375-9b90-38a223e42817',
        status: UserStatus.ACTIVE,
        firstName: 'John',
        lastName: 'Doe',
      }),
    ),
  })
  readonly user: LoginResult['user'];

  @ApiProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    required: true,
  })
  readonly access_token: string;

  constructor(params: Partial<LoginResult>) {
    this.user = params.user;
    this.access_token = params.access_token;
  }
}
