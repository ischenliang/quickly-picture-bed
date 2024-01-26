import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const Ip = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest()
  let ip: any = req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
      req.ip  ||
      req.connection.remoteAddress || // 判断 connection 的远程 IP
      req.socket.remoteAddress || // 判断后端的 socket 的 IP
      ''
  if (ip) {
    ip = ip.replace('::ffff:', '')
  }
  return ip
})