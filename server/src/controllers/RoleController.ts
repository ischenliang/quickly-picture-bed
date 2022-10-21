import { Controller, Get, Post, Put, Params, Body, Query, CurrentUser, Flow, Delete, State, Header } from 'koa-ts-controllers'
import moment from 'moment'
import RoleModel  from '../models/Role'
import { Role } from '../types'
import authorization from '../middlewares/authorization'

@Controller('/role')
class RoleController {
  @Get('/list')
  async list() {
    return {
      code: 200,
      message: '访问成功了0',
      data: await RoleModel.findAll()
    }
  }

  @Get('/detail/:id')
  async detail(@Params('id') id: string, @Query('search') search: string) {
    console.log('query参数：', search)
    return {
      code: 200,
      message: '访问成功了0',
      data: await RoleModel.findOne({
        where: {
          id
        }
      })
    }
  }

  // 这里需要注意，必须要事先配置koa-body，否则是无法获取body的
  @Post('/add')
  @Flow([authorization]) // 这个注解用于鉴权，可以放在@Controller下面代表下面的所有接口都需要鉴权
  async add(@Body({required: true}) role: Role) {
    role.ctime = moment().format('YYYY-MM-DD HH:mm:ss')
    role.mtime = moment().format('YYYY-MM-DD HH:mm:ss')
    return {
      code: 200,
      message: '我需要登录后才能看到',
      data: await RoleModel.create(role)
    }
  }

  @Put('/update')
  async update(@Body({required: true}) role: Role) {
    role.ctime = moment().format('YYYY-MM-DD HH:mm:ss')
    role.mtime = moment().format('YYYY-MM-DD HH:mm:ss')
    return {
      code: 200,
      message: '更新成功',
      data: await RoleModel.update(role, {
        where: {
          id: role.id
        }
      })
    }
  }

  @Delete('/deleteById/:id')
  async deleteById(@Params('id') id: string) {
    return {
      code: 200,
      message: '删除成功',
      data: await RoleModel.destroy({
        where: {
          id
        }
      })
    }
  }

  // @CurrentUser()：获取的是在app.ts中设置的 ctx.state.user上挂载的数据
  // @State()：获取的是在app.ts中设置的 ctx.state 上挂载的数据
  @Get('/test')
  async test (@CurrentUser() user: any, @State() state: any, @Header() headers: any) {
    console.log(user) // super
    console.log(state) // { user: 'super', code: 200 }
    return {
      code: 200,
      message: '成功了'
    }
  }

  // 更多的注解@Session()、@Req()、@Res()、@Ctx()等可参考官方文档
}