import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.dto';

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  // Assuming `userId` is stored in `request.user` (e.g., after authentication middleware)
  return request.user as JwtPayload;
});
