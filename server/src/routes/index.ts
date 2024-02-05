// routes/index.ts
import KoaRouter from 'koa-router'
// 这样代码才有智能提示
import { Context, Next } from 'koa'
import Role from '../models/Role' //班级管理服务

const router = new KoaRouter()

router.get('/home', async (ctx: Context, next: Next) => {
  const res = await Role.findAll()
  ctx.body = res
})

export default router