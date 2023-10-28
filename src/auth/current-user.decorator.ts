import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * CurrentUser.
 *
 * @author dafengzhen
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
