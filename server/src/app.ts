// 为了确保环境变量被加载，顾放在第一行
import dotenv from 'dotenv'
dotenv.config()

import Koa, { Context, Next } from 'koa'
import KoaRouter from 'koa-router'
import koaBody from 'koa-body'// 解析请求体
import { bootstrapControllers } from 'koa-ts-controllers'
import * as Colors from 'colors.ts'
import cors from 'koa2-cors'
import webtoken from 'jsonwebtoken'
import koaStatic from 'koa-static'
import path from 'path'
import UserModel from './models/User';
import { User } from './types';
import AlbumController from './controllers/AlbumController'
import BucketController from './controllers/BucketController'
import BucketSourceController from './controllers/BucketSourceController'
import BucketSourceHistoryController from './controllers/BucketSourceHistoryController'
import DictController from './controllers/DictController'
import HabitsController from './controllers/HabitsController'
import ImageController from './controllers/ImageController'
import LogController from './controllers/LogController'
import PublicController from './controllers/PublicController'
import RoleController from './controllers/RoleController'
import SettingController from './controllers/SettingController'
import ToolController from './controllers/ToolController'
import UserController from './controllers/UserController'

// 实例化koa
const app: Koa = new Koa({
  proxy: true,
  proxyIpHeader: 'x-forwarded-for'
})
app.use(cors({
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}))
const router: KoaRouter = new KoaRouter()
Colors.enable()

function getClientIP(req: any) {
  let ip = req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    req.ip  ||
    req.connection.remoteAddress || // 判断 connection 的远程 IP
    req.socket.remoteAddress || // 判断后端的 socket 的 IP
    req.connection.socket.remoteAddress || ''
  if(ip) {
    ip = ip.replace('::ffff:', '')
  }
  return ip;
}



// 处理404不存在的
app.use(async (ctx: Koa.DefaultContext, next: Next) => {
  console.log(`${ctx.req.method}: `, `-----${ctx.req.url}`.green);
  ctx.set('Content-Type', 'application/json; charset=utf-8')
  ctx.req_ip = getClientIP(ctx.req)
  // 这里还需要区分是哪些接口需要单独处理：例如登录、注册不需要传入token
  if (ctx.headers['authorization']) {
    try {
      const res: any = webtoken.verify(ctx.headers['authorization'], 'a1b2c3')
      // 这里鉴权当前用户是否存在于数据库中，否则可以直接访问管理端
      const curUser = await UserModel.findOne({
        where: {
          id: res.data
        }
      }) as User
      if (curUser && curUser.email) {
        ctx.state = {
          user: {
            id: res.data,
            role: res.role
          },
          code: 200,
        }
        await next()
      } else {
        ctx.body = {
          code: 401,
          message: '登录状态已失效，请重新登录'
        }
      }
    } catch (error) {
      if (['jwt expired', 'jwt malformed'].includes(error.message)) {
        ctx.body = {
          code: 401,
          message: '登录状态已失效，请重新登录'
        }
      } else {
        ctx.body = {
          code: 500,
          message: error.message
        }
      }
    }
  } else {
    await next()
  }
})


// 启动路由
;(async () => {
  // 在controllers中读文件涉及到异步
  // 后续访问就需要 host:port/api/v1/接口地址
  await bootstrapControllers(app, {
    router: router, // 内部还是要使用router来实现路由绑定
    basePath: '/api', // 定义api的规则【所有接口的基础路径】
    versions: [1], // 版本
    // 这样打包会失效
    // __dirname + '/controllers/**/*.ts'
    controllers: [
      AlbumController,
      BucketController,
      BucketSourceController,
      BucketSourceHistoryController,
      DictController,
      HabitsController,
      ImageController,
      LogController,
      PublicController,
      RoleController,
      SettingController,
      ToolController,
      UserController
    ], // 存放所有控制器类，是数组
    errorHandler (error: any, ctx: Context) {
      console.log(123, error)
      ctx.body = {
        code: error.status || 500,
        message: '报错了',
        data: error.message
      }
    }
  })

  // 解析request body
  app.use(koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 * 1024 // 文件最大支持的大小
    }
  }))

  // 处理静态目录，为了能够直接在外部访问
  app.use(koaStatic(path.join(__dirname, './public/')))

  // 注册路由
  app.use(router.routes())
  app.use(router.allowedMethods())

  // 监听端口
  const port = process.env.APP_PORT || 3002
  app.listen(port, () => {
    console.log(' DONE '.bg_green, 'Compiled successfully in 10ms'.green);
    console.log(`访问启动成功：`, `http://localhost:${port}`.green);
  })
})()