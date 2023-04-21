import { bootstrapControllers as KoaControllers } from 'koa-ts-controllers'
import Koa from 'koa'
import KoaRouter from 'koa-router'
import koaBody from 'koa-body'

function loadMiddlewares (app: Koa, router: KoaRouter, callback: Function) {
  (async () => {
    // 在controllers中读文件涉及到异步
    // 后续访问就需要 host:port/api/v1/接口地址
    await KoaControllers(app, {
      router: router, // 内部还是要使用router来实现路由绑定
      basePath: '/api', // 定义api的规则【所有接口的基础路径】
      versions: [1], // 版本
      // 存放所有控制器类，是数组
      controllers: [__dirname + '/controllers/**/*']
    })

    // 解析request body
    app.use(koaBody({
      // enableTypes: ['json', 'form', 'text'],
      multipart: true, // 是否支持 multipart-formdate 的表单
      formidable: {
        maxFileSize: 200 * 1024 * 1024 // 文件最大支持的大小
      }
    }))
    // 注册路由
    app.use(router.routes())

    // 监听端口
    app.listen(3002, () => {
      console.log(' DONE '.bgGreen, 'Compiled successfully in 10ms'.green);
      console.log(`访问启动成功：`, 'http://localhost:3002'.green);
    })
  })();
  
  callback()
}

export default loadMiddlewares