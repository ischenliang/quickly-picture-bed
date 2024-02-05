// 鉴权中间件
import {Context, Next} from 'koa'
import Boom from '@hapi/boom'

export default async function authorization(ctx: Context, next: Next) {
  if (!ctx.userInfo || ctx.userInfo.id < 1) {
  }
  await next()
}


/**
 * 管理员权限才能操作
 * @param ctx 
 * @param next 
 */
export async function useRoleAuthorization (ctx: Context, next: Next) {
  if (ctx.state && ctx.state.user && ctx.state.user.role !== 10) {
    throw Boom.unauthorized('无操作权限')
  }
  await next()
}