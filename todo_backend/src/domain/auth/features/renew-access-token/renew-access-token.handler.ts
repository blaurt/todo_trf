import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { JwtSecretRequestType, JwtService } from '@nestjs/jwt';
import { withLogger } from 'src/utils/app-logger/with-logger.decorator';
import { EnvService } from 'src/utils/env/env.service';
import { z } from 'zod';

export class RenewAccessTokenCommand implements ICommand {
  private readonly _schema = z.object({
    refreshToken: z.string(),
  });

  constructor(readonly refreshToken: string) {
    this._schema.parse(this);
  }
}

@CommandHandler(RenewAccessTokenCommand)
export class RenewAccessTokenHandler implements ICommandHandler<RenewAccessTokenCommand> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly env: EnvService,
  ) {}

  @withLogger()
  async execute(command: RenewAccessTokenCommand): Promise<any> {
    const payload = await this.jwtService.verifyAsync(command.refreshToken);

    return this.jwtService.signAsync(
      {
        userData: payload.userData,
      },
      { expiresIn: +this.env.get('JWT_ACCESS_TOKEN_TTL') },
    );
  }
}
