import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest()
  return req.user
})