// 鉴权中间件
import {Context, Next} from 'koa'
import Boom from '@hapi/boom'

export default async function authorization(ctx: Context, next: Next) {
  if (!ctx.userInfo || ctx.userInfo.id < 1) {
    throw Boom.unauthorized('无权访问，请先登录')
  }
  await next()
}